import { useDbClient } from '~/composables/useDbClient'

export default defineEventHandler(async () => {
  const client = await useDbClient()

  const rows = (await client.query(`
    SELECT
      product_id,
      product_name,
      description,
      image_name,
      price,
      rating
    FROM products
    WHERE removed = 0
    ORDER BY rating DESC, product_id ASC
  `)) as {
    product_id: number
    product_name: string
    description: string | null
    image_name: string
    price: string
    rating: number
  }[]

  client.end()

  return rows.map(p => ({
    productId: p.product_id,
    productName: p.product_name,
    description: p.description,
    imageName: p.image_name,
    price: Number(p.price),
    rating: p.rating
  }))
})
