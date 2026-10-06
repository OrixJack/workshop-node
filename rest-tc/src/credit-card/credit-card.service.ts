import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditCard } from '../entities/CreditCard.js';
import { CreditCardStartDigits, SecurityCodeLength } from './credit-card.interface.js';

@Injectable()
export class CreditCardService {
    constructor(
        @InjectRepository(CreditCard)
        private readonly creditCardRepository: Repository<CreditCard>
    ) {}

    async getAllCreditCards() {
        const cards = await this.creditCardRepository.find({relations: {statusData: true, cardTypeData: true}}) ?? [];
        if (!cards || cards.length === 0) {
            throw new HttpException(`No credit cards found`, HttpStatus.NOT_FOUND);
        }
        return cards;
    }

    async getById(id: string) {
        const card = await this.creditCardRepository.findOne({where:{id}, relations: {statusData: true, cardTypeData: true}});
        if (!card) {
            throw new HttpException(`Credit card with id ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return card;
    }

    async createCreditCard(newCardData: CreditCard): Promise<CreditCard> {
        try {
            //validar que no se este duplicando la llave primaria
            const card = await this.creditCardRepository.findOne({where:{id: newCardData.id}});
            if (card) {
                throw new HttpException(`Credit card with id ${newCardData.id} already exists`, HttpStatus.CONFLICT);
            }
            
            //valida formatos de numero de tarjeta y codigo de seguridad
            const cardType = this.validateCardNumber(newCardData.cardNumber);
            newCardData.cardType = cardType;
            this.validateSecurityCode(newCardData.securityCode, cardType);

            //valida fecha ingresada
            this.validateExpiryDate(newCardData.expiryDate);

            // bloqueo por defecto, por seguridad
            newCardData.status = 3;

            //creacion de tarjetas despues de validaciones
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

        //validar negaciones de actualizacion para campos no permitidos
        this.validateFields(updateData, card);

        //validar formatos de numero de tarjeta y codigo de seguridad si se estan actualizando
        if (updateData.cardNumber) {
            const cardType = this.validateCardNumber(updateData.cardNumber);
            updateData.cardType = cardType;
            if (updateData.securityCode) {
                this.validateSecurityCode(updateData.securityCode, cardType);
            }
        }

        //validar fecha de expiracion si se esta actualizando
        if (updateData.expiryDate) {
            this.validateExpiryDate(updateData.expiryDate);
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

    //======= Metodos privados de validacion y utilidades =======
    private validateFields(updateData: Partial<CreditCard>, card: CreditCard) {
        if (updateData.cardType && updateData.cardType !== card.cardType) {
            throw new HttpException(`Updating cardType is not allowed`, HttpStatus.BAD_REQUEST);
        }
        if (updateData.cardHolderName && updateData.cardHolderName !== card.cardHolderName) {
            throw new HttpException(`Updating cardHolderName is not allowed`, HttpStatus.BAD_REQUEST);
        }
        if (updateData.id && updateData.id !== card.id) {
            throw new HttpException(`Updating id is not allowed`, HttpStatus.BAD_REQUEST);
        }
        if (updateData.status && updateData.status !== card.status) {
            throw new HttpException(`Updating status is not allowed`, HttpStatus.BAD_REQUEST);
        }
        if (updateData.clientId && updateData.clientId !== card.clientId) {
            throw new HttpException(`Updating clientId is not allowed`, HttpStatus.BAD_REQUEST);
        }
    }
    
    private validateCardNumber(cardNumber: string): number {
        
        //validamos que sea numero de 16 digitos
        const cardNumberRegex = /^\d{16}$/;
        if (!cardNumberRegex.test(cardNumber)) {
            throw new HttpException(`Invalid credit card number format`, HttpStatus.BAD_REQUEST);
        }

        //validarmos que sea tenga inicio correcto
        const typeCard = Object.entries(CreditCardStartDigits).find(([_, digits]) =>
            digits.some(digit => cardNumber.startsWith(digit.toString()))
        );

        if (!typeCard) {
            throw new HttpException(`Invalid credit card number start`, HttpStatus.BAD_REQUEST);
        }

        return Number(typeCard[0]); // retorna el tipo de tarjeta valida como numero
    }

    private validateSecurityCode(securityCode: number, cardType: number): void {
        const expectedLength = SecurityCodeLength[cardType as keyof typeof SecurityCodeLength];
        if (securityCode.toString().length !== expectedLength) {
            throw new HttpException(`Invalid security code length for cardType ${cardType}`, HttpStatus.BAD_REQUEST);
        }
    }

    private validateExpiryDate(expiryDate: string): void {
        //validamos que sea en formato MM/YY
        const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryDateRegex.test(expiryDate)) {
            throw new HttpException(`Invalid expiry date format`, HttpStatus.BAD_REQUEST);
        }

        //validamos que no este vencida
        const [month, year] = expiryDate.split('/').map(Number);
        const now = new Date();
        const expiry = new Date(2000 + year, month - 1);
        if (expiry < now) {
            throw new HttpException(`Credit card is expired`, HttpStatus.BAD_REQUEST);
        }
    }
}
