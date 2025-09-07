import { useDbClient } from '~/composables/useDbClient'

export default defineEventHandler(async (event) => {
  const db = await useDbClient()

  const { id } = event.context.params
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Product ID missing' })
  }

  const r = (await db.query(
    'SELECT product_id, product_name, description, price, rating, removed FROM products WHERE product_id = ? LIMIT 1',
    [id]
  )) as {
    product_id: string
    product_name: string
    description: string
    price: string
    rating: number
    removed: number
  }[]

  db.end()

  if (!r.length) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  const product = r[0]

  return {
    productId: +product.product_id,
    productName: product.product_name,
    price: +product.price,
    description: product.description,
    rating: product.rating,
    removed: product.removed
  }
})
