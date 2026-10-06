export interface ICreditCard {
    id?: string;
    cardNumber: string;
    expiryDate: string;
    cardHolderName: string;
    status: 'active' | 'inactive' | 'blocked';
    creditLimit: number;
}

export const CreditCardStartDigits = {
    1: [4], //visa
    2: [51, 52, 53, 54, 55], //mastercard
    3: [34, 37], //amex
    4: [6] //discover
} as const;

export const SecurityCodeLength = {
    1: 3,
    2: 3,
    3: 4,
    4: 3
} as const;