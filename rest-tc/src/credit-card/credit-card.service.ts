import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditCard } from '../entities/CreditCard.js';

@Injectable()
export class CreditCardService {
    constructor(
        @InjectRepository(CreditCard)
        private readonly creditCardRepository: Repository<CreditCard>
    ) {}

    async getAllCreditCards() {
        const cards = await this.creditCardRepository.find({relations: {statusData: true}}) ?? [];
        if (!cards || cards.length === 0) {
            throw new HttpException(`No credit cards found`, HttpStatus.NOT_FOUND);
        }
        return cards;
    }

    async getById(id: string) {
        const card = await this.creditCardRepository.findOne({where:{id}, relations: {statusData: true}});
        if (!card) {
            throw new HttpException(`Credit card with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return card;
    }

    async createCreditCard(newCardData: CreditCard): Promise<CreditCard> {
        //validar que no se este duplicando la llave primaria
        const card = await this.creditCardRepository.findOne({where:{id: newCardData.id}});
        if (card) {
            throw new HttpException(`Credit card with id ${newCardData.id} already exists`, HttpStatus.CONFLICT);
        }

        // bloqueo por defecto, por seguridad
        newCardData.status = 3;
        try {
            return await this.creditCardRepository.save(newCardData);
        } catch (error: any) {
            throw new HttpException(`Failed to create credit card. Error: ${error.message}`, HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async updateCreditCard(id: string, updateData: Partial<CreditCard>): Promise<CreditCard> {
        const card = await this.creditCardRepository.findOne({where:{id}});
        if (!card) {
            throw new HttpException(`Credit card with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedCard = { ...card, ...updateData };
        try {
            return await this.creditCardRepository.save(updatedCard);
        } catch (error: any) {
            throw new HttpException(`Failed to update credit card with id ${id}. Error: ${error.message}`, HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async deleteCreditCard(id: string): Promise<void> {
        const card = await this.creditCardRepository.findOne({where:{id}});

        if (!card) {
            throw new HttpException(`Credit card with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        // eliminacion logica, pasamos el status a inactive
        card.status = 2; 
        try {
            await this.creditCardRepository.save(card);
        } catch (error: any) {
            throw new HttpException(`Failed to delete credit card with id ${id}. Error: ${error.message}`, HttpStatus.NOT_IMPLEMENTED);
        }
    }
}
