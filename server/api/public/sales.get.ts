import { useDbClient } from '~/composables/useDbClient'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const saleId = Number(query.saleId)

  if (!saleId) {
    throw createError({
      statusCode: 400,
      message: 'saleId is required'
    })
  }

  const client = await useDbClient()

  try {
    // 🔹 Fetch sale info
    const saleRows = (await client.query(
      `SELECT 
         s.sale_id,
         s.user_id,
         s.sale_date,
         s.total_amount,
         ss.status
       FROM sales s
       JOIN sale_status ss ON s.sale_status = ss.id
       WHERE s.sale_id = ?`,
      [saleId]
    )) as {
      sale_id: number
      user_id: number
      sale_date: string
      total_amount: number
      status: string
    }[]

    if (!saleRows.length) {
      throw createError({
        statusCode: 404,
        message: 'Sale not found'
      })
    }

    const sale = saleRows[0]

    // 🔹 Fetch sale details
    const detailsRows = (await client.query(
      `SELECT 
         sd.product_id,
         p.product_name,
         sd.quantity,
         sd.price
       FROM sale_details sd
       JOIN products p ON sd.product_id = p.product_id
       WHERE sd.sale_id = ?`,
      [saleId]
    )) as {
      product_id: number
      product_name: string
      quantity: number
      price: number
    }[]

    return {
      sale: {
        saleId: sale.sale_id,
        userId: sale.user_id,
        saleDate: sale.sale_date,
        totalAmount: Number(sale.total_amount),
        status: sale.status
      },
      saleDetails: detailsRows.map(d => ({
        productId: d.product_id,
        productName: d.product_name,
        quantity: d.quantity,
        price: Number(d.price)
      }))
    }
  } finally {
    client.end()
  }
})
