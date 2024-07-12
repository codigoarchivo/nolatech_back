import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize(
  `${process.env.POSTGRES_DATABASE}`,
  `${process.env.POSTGRES_USER}`,
  `${process.env.POSTGRES_PASSWORD}`,
  {
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: (process.env as { DB_ENABLE_SSL: boolean | undefined }).DB_ENABLE_SSL,
    },
    pool: {
      max: 15,
      min: 5,
      idle: 20000,
      evict: 15000,
      acquire: 30000,
    },
  }
);
export default db;
