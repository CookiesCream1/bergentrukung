import { createConnection } from 'mariadb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event).query as string

  if (!query) {
    return { products: [] }
  }

  // Connect to MariaDB
  const connection = await createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_pwd,
    database: process.env.db_name,
    port: Number(process.env.MYSQLPORT) || 3306
  })

  try {
    // Search in product_name and description
    const results = await connection.query(
      `SELECT product_id, product_name, description 
       FROM products 
       WHERE product_name LIKE ? OR description LIKE ?`,
      [`%${query}%`, `%${query}%`]
    )
    return { products: results }
  } finally {
    connection.end()
  }
})
