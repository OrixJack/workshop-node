import { DataSource } from 'typeorm';
import { CreditCard } from './entities/CreditCard.js';
import { CreditCardStatus } from './entities/CreditCardStatus.js';
import { Client } from './entities/Client.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'usr_class',
  password: process.env.DB_PASSWORD || 'my_class',
  database: process.env.DB_NAME || 'virtual_bank',
  entities: [CreditCard, CreditCardStatus, Client],
  synchronize: false,
  logging: false,
});
