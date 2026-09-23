export enum AccountType {
  Cash = 'cash',
  CreditCard = 'credit_card',
  Checkings = 'checkings',
  Savings = 'savings',
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
