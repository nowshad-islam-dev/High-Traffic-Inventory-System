import { Sequelize } from 'sequelize';
import env from './env';

export const sequelize = new Sequelize(
  env.POSTGRES_DB,
  env.POSTGRES_USER,
  env.POSTGRES_PASSWORD,
  {
    dialect: 'postgres',
  },
);
