export enum AccountType {
  Cash = 'cash',
  CreditCard = 'credit_card',
  Checkings = 'checkings',
  Savings = 'savings',
}

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  currency: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  currency: string;
}
