import { readRawBody } from 'h3'
import Stripe from 'stripe'
import { useDbClient } from '~/composables/useDbClient'
import useMail from '~/composables/useMail'
import { stripe } from '~/server/utils/stripe'

export const config = {
  api: {
    bodyParser: false
  }
}

export default defineEventHandler(async (event) => {
  const sig = event.node.req.headers['stripe-signature']
  if (!sig) {
    setResponseStatus(event, 400)
    return 'Missing Stripe signature'
  }

  const rawBody = await readRawBody(event)
  if (!rawBody) {
    setResponseStatus(event, 400)
    return 'Missing body'
  }

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    setResponseStatus(event, 400)
    return 'Invalid signature'
  }

  const db = await useDbClient()
  const mailClient = useMail()

  try {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded': {
        const intent = stripeEvent.data.object as Stripe.PaymentIntent
        const saleId = intent.metadata?.saleId
        if (!saleId) { break }

        await db.query('START TRANSACTION')

        try {
          // Lock sale row (idempotency protection)
          const [sale] = await db.query(
            `SELECT sale_status, payment_intent_id
             FROM sales
             WHERE sale_id = ?
             FOR UPDATE`,
            [saleId]
          ) as any[]

          // Already processed → ignore duplicate webhook
          if (!sale || sale.payment_intent_id) {
            await db.query('ROLLBACK')
            break
          }

          await db.query(
            `UPDATE sales
             SET sale_status = (SELECT id FROM sale_status WHERE status = 'success'),
                 payment_intent_id = ?
             WHERE sale_id = ?`,
            [intent.id, saleId]
          )

          const userResult = await db.query(
            `SELECT u.email
             FROM users u
             JOIN sales s ON s.user_id = u.user_id
             WHERE s.sale_id = ?`,
            [saleId]
          ) as { email: string }[]

          if (userResult.length) {
            await mailClient.sendMail({
              from: '"Objednávky" <luky.pospa04@gmail.com>',
              to: userResult[0].email,
              subject: 'Potvrzení objednávky #' + saleId,
              html: `
                <div style="font-family: Arial, sans-serif; color:#111; max-width:600px; margin:auto;">
                  <h2 style="color:#1f2937;">Děkujeme za Vaši objednávku</h2>
            
                  <p>
                    Vaše objednávka byla <strong>úspěšně zaplacena</strong> 🎉
                  </p>
            
                  <p>
                    <strong>Číslo objednávky:</strong><br>
                    ${saleId}
                  </p>
            
                  <hr style="margin:24px 0;">
            
                  <p>
                    Pokud máte jakékoli dotazy, neváhejte nás kontaktovat odpovědí na tento e-mail.
                  </p>
            
                  <p style="margin-top:32px;">
                    S pozdravem<br>
                    <strong>Tým obchodu</strong>
                  </p>
            
                  <p style="font-size:12px; color:#6b7280; margin-top:24px;">
                    Tento e-mail byl odeslán automaticky, prosím neodpovídejte na něj přímo.
                  </p>
                </div>
              `
            })
          }

          await db.query('COMMIT')
        } catch (err) {
          await db.query('ROLLBACK')
          throw err
        }

        break
      }

      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled': {
        const intent = stripeEvent.data.object as Stripe.PaymentIntent
        const saleId = intent.metadata?.saleId
        if (!saleId) { break }

        await db.query(
          `UPDATE sales
           SET sale_status = (SELECT id FROM sale_status WHERE status = 'cancelled')
           WHERE sale_id = ?
             AND payment_intent_id IS NULL`,
          [saleId]
        )
        break
      }

      case 'charge.refunded': {
        const charge = stripeEvent.data.object as Stripe.Charge
        const saleId = charge.metadata?.saleId
        if (!saleId) { break }

        await db.query(
          `UPDATE sales
           SET sale_status = (SELECT id FROM sale_status WHERE status = 'refunded')
           WHERE sale_id = ?`,
          [saleId]
        )
        break
      }
    }

    return { received: true }
  } catch (err) {
    console.error('Webhook error:', err)
    setResponseStatus(event, 500)
    return 'Webhook handling failed'
  } finally {
    try { db.end() } catch {}
    try { mailClient.close() } catch {}
  }
})
