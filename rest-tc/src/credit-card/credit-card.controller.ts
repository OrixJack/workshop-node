import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CreditCardService } from './credit-card.service.js';;
import { UuidController } from '../uuid/uuid.controller.js';
import { UuidService } from '../uuid/uuid.service.js';
import { CreditCard } from '../entities/CreditCard.js';

@Controller('credit-card')
export class CreditCardController {
  @Get()
  async allCards() {
    const cards = await this.creditCardService.getAllCreditCards();
    if (!cards || cards.length === 0) {
      throw new Error('No credit cards found');
    }
    return cards;
  }

  @Get(':id')
  async getCardById(@Param('id') id: string) {
    const card = await this.creditCardService.getById(id);
    if (!card) {
      throw new Error(`Credit card with id ${id} not found`);
    }
    return card;
  }

  @Post()
  async createCard(@Body() newCardData: CreditCard) {
    if (!newCardData.cardNumber || !newCardData.cardHolderName || !newCardData.expiryDate) {
      throw new Error('Invalid credit card data');
    }

    const idCard = new UuidController(new UuidService()).generateUuid().uuid;
    const newCard: CreditCard = await this.creditCardService.createCreditCard({ ...newCardData, id: idCard });

    if (!newCard) {
      throw new Error('Failed to create credit card');
    }
    return newCard;
  }

  @Patch(':id')
  async updateCard(@Param('id') id: string, @Body() updateData: Partial<CreditCard>) {
    const updatedCard = await this.creditCardService.updateCreditCard(id, updateData);
    if (!updatedCard) {
      throw new Error(`Failed to update credit card with id ${id}`);
    }
    return updatedCard;
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string) {
    const result = await this.creditCardService.deleteCreditCard(id); 
    //pendiente validar el resultado para personalizar el mensaje de error
    return result;
   }

  constructor(private readonly creditCardService: CreditCardService) {}
}
