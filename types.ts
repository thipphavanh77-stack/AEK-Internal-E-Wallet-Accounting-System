export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  amount: number;
  name: string;
  category: string;
  payment_method: string;
  reference?: string;
  note?: string;
  status: 'active' | 'cancelled';
  created_at: string;
  created_by: string;
}

export interface AppConfig {
  company_name: string;
  currency: string;
  dashboard_title: string;
  primary_color: string;
  secondary_color: string;
  danger_color: string;
}

export type ViewState = 'dashboard' | 'income' | 'expense' | 'reports';

export interface DashboardStats {
  income: number;
  expense: number;
  balance: number;
}