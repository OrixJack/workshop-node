import { Controller, Get, Post, Body, Param, Patch, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CreditCardService } from './credit-card.service.js';
import { CreditCard } from '../entities/CreditCard.js';

@Controller('credit-card')
export class CreditCardController {
  @Get()
  async allCards() {
    return await this.creditCardService.getAllCreditCards();
  }

  @Get(':id')
  async getCardById(@Param('id') id: string) {
    return await this.creditCardService.getById(id);
  }

  @Post()
  async createCard(@Body() newCardData: CreditCard) {
    if (!newCardData.cardNumber || !newCardData.cardHolderName || !newCardData.expiryDate) {
      throw new HttpException(`Invalid credit card data`, HttpStatus.BAD_REQUEST);
    }
    return await this.creditCardService.createCreditCard(newCardData);
  }

  @Patch(':id')
  async updateCard(@Param('id') id: string, @Body() updateData: Partial<CreditCard>) {
    const updatedCard = await this.creditCardService.updateCreditCard(id, updateData);
    if (!updatedCard) {
      throw new HttpException(`Failed to update credit card with id ${id}`, HttpStatus.NOT_FOUND);
    }
    return updatedCard;
  }

  @Delete(':id')
  async deleteCard(@Param('id') id: string) {
    await this.creditCardService.deleteCreditCard(id); 
   }

  constructor(private readonly creditCardService: CreditCardService) {}
}
