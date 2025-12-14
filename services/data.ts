import { Transaction } from '../types';

const STORAGE_KEY = 'aek_wallet_transactions';

// Mock initial data if empty
const INITIAL_DATA: Transaction[] = [];

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_DATA;
  } catch (e) {
    console.error("Failed to load transactions", e);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error("Failed to save transactions", e);
  }
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('lo-LA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('lo-LA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const INCOME_CATEGORIES = [
  "ຂາຍສິນຄ້າ",
  "ບໍລິການ",
  "ຄ່າຄອມມິດຊັນ",
  "ເງິນລົງທຶນ",
  "ລາຍຮັບອື່ນໆ"
];

export const EXPENSE_CATEGORIES = [
  "ເງິນເດືອນ",
  "ຄ່າເຊົ່າ",
  "ຄ່າໄຟຟ້າ-ນ້ຳ",
  "ຄ່າວັດສະດຸ",
  "ຄ່າການຕະຫຼາດ",
  "ຄ່າຂົນສົ່ງ",
  "ຄ່າໃຊ້ຈ່າຍອື່ນໆ"
];

export const PAYMENT_METHODS = ["BCEL QR", "ເງິນສົດ", "ໂອນທະນາຄານ", "ອື່ນໆ"];

export const DEFAULT_CONFIG = {
  company_name: "AEK",
  currency: "LAK",
  dashboard_title: "ລະບົບກະເປົາເງິນອີເລັກໂຕຣນິກ",
  primary_color: "#3b82f6", // blue-500
  secondary_color: "#10b981", // emerald-500
  danger_color: "#ef4444", // red-500
};