export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export enum TransactionCategory {
  Grocery = 'Grocery',
  Travel = 'Travel',
  Food = 'Food',
  Rent = 'Rent',
  Purchase = 'Purchase',
  Transfer = 'Transfer',
  Other = 'Other',
}

export type Transaction = {
  id: string;
  description: string | null;
  amountCents: number;
  type: TransactionType;
  category: TransactionCategory;
  accountId: string;
  createdAt: string;
  updatedAt: string;
};
