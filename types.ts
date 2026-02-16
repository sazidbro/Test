
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum ExpenseCategory {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  STUDY = 'Study',
  SHOPPING = 'Shopping',
  RENT = 'Rent',
  ENTERTAINMENT = 'Entertainment',
  OTHERS = 'Others'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  theme: 'light' | 'dark';
}
