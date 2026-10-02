import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCard } from './entities/CreditCard.js';
import { CreditCardStatus } from './entities/CreditCardStatus.js';
import { Client } from './entities/Client.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CreditCardModule } from './credit-card/credit-card.module.js';
import { UuidService } from './uuid/uuid.service.js';
import { UuidController } from './uuid/uuid.controller.js';
import { UuidModule } from './uuid/uuid.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'usr_class',
      password: process.env.DB_PASSWORD || 'my_class',
      database: process.env.DB_NAME || 'virtual_bank',
      entities: [CreditCard, CreditCardStatus, Client],
      synchronize: false,
      logging: false,
    }),
    CreditCardModule,
    UuidModule,
  ],
  controllers: [AppController, UuidController],
  providers: [AppService, UuidService],
})
export class AppModule {}
