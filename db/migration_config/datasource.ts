import path from 'path'
import { DataSource, type DataSourceOptions } from 'typeorm'

// Get the database url
const databaseUrl =
  process.env['DB_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/arbor'

// Set up the TypeORM data source options
export const typeormOptions: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  synchronize: false,
  migrationsRun: false,
  dropSchema: false,
  entities: [path.join(__dirname, '../../src/schema/entities/**/*.entity.js')],
  migrations: [path.join(__dirname, '../migrations/**/*.js')],
  ...(databaseUrl.includes('localhost')
    ? {}
    : {
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
}

export const AppDataSource = new DataSource(typeormOptions)
