import * as mariadb from 'mariadb'

let connectionPool: mariadb.Pool | null = null

export const useDbClient = async () => {
  if (!connectionPool) {
    const config = useRuntimeConfig()
    const { host, user, password, port, database } = config.mariadb

    if (!host || !user || !database || !port) {
      throw new Error('MariaDB runtime config is incomplete.')
    }

    connectionPool = mariadb.createPool({
      host,
      port,
      user,
      password,
      database,
      connectTimeout: 10000,
      connectionLimit: 16
    })
  }

  const conn = await connectionPool.getConnection()

  return conn
}
