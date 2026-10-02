import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCardController } from './credit-card.controller.js';
import { CreditCardService } from './credit-card.service.js';
import { CreditCard } from '../entities/CreditCard.js';
import { CreditCardStatus } from '../entities/CreditCardStatus.js';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard, CreditCardStatus])],
  controllers: [CreditCardController],
  providers: [CreditCardService]
})
export class CreditCardModule {}
