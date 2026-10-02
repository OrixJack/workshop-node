export interface ICreditCard {
    id?: string;
    cardNumber: string;
    expiryDate: string;
    cardHolderName: string;
    status: 'active' | 'inactive' | 'blocked';
    creditLimit: number;
}
