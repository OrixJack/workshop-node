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
        return await this.creditCardRepository.find() ?? [];
    }

    async getById(id: string) {
        return await this.creditCardRepository.findOne({where:{id}});
    }

    async createCreditCard(newCardData: CreditCard): Promise<CreditCard> {
        return await this.creditCardRepository.save(newCardData);
    }

    async updateCreditCard(id: string, updateData: Partial<CreditCard>): Promise<CreditCard> {
        const card = await this.creditCardRepository.findOne({where:{id}});

        if (!card) {
            throw new HttpException(`Credit card with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        const updatedCard = { ...card, ...updateData };
        return await this.creditCardRepository.save(updatedCard);
    }

    async deleteCreditCard(id: string): Promise<void> {
        const card = await this.creditCardRepository.findOne({where:{id}});

        if (!card) {
            throw new HttpException(`Credit card with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        // eliminacion logica, pasamos el status a inactive
        card.status = 2;
        await this.creditCardRepository.save(card);
    }
}
