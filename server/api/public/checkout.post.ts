import { z } from 'zod'
import { getServerSession } from '#auth'
import { useDbClient } from '~/composables/useDbClient'

const validator = z.object({
  total_price: z.number().positive(),
  product_arr: z.array(
    z.object({
      product_id: z.number(),
      price: z.number().positive(),
      count: z.number().int().positive()
    })
  )
})

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  // @ts-expect-error
  const uid = session?.user?.id

  if (!uid) {
    setResponseStatus(event, 401, 'User not authenticated')
    return
  }

  const parsed = validator.safeParse(await readBody(event))
  if (!parsed.success) {
    setResponseStatus(event, 400, 'Invalid request body')
    return
  }

  const body = parsed.data
  const db = await useDbClient()

  try {
    await db.query('START TRANSACTION')

    const statusResult = await db.query(
      'SELECT id FROM sale_status WHERE status = "pending" LIMIT 1'
    ) as { id: number }[]

    if (!statusResult.length) {
      throw new Error('Pending sale status not found')
    }

    const pendingStatusId = statusResult[0].id

    const saleResult = await db.query(
      `INSERT INTO sales (user_id, total_amount, sale_status)
       VALUES (?, ?, ?)`,
      [uid, body.total_price, pendingStatusId]
    ) as { insertId: number }

    const saleId = saleResult.insertId

    await db.query(
      `INSERT INTO sale_details (sale_id, product_id, quantity, price)
       VALUES ${body.product_arr.map(() => '(?, ?, ?, ?)').join(', ')}`,
      body.product_arr.flatMap(p => [
        saleId,
        p.product_id,
        p.count,
        p.price
      ])
    )

    await db.query('COMMIT')

    // IMPORTANT: return saleId for Stripe metadata
    return { saleId }
  } catch (error) {
    await db.query('ROLLBACK')
    console.error('Checkout error:', error)
    setResponseStatus(event, 500, 'Internal server error')
  } finally {
    db.end()
  }
})
