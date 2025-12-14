import React from 'react';
import { Transaction, AppConfig } from '../types';
import { formatNumber } from '../services/data';

interface ReportsProps {
  transactions: Transaction[];
  config: AppConfig;
}

const Reports: React.FC<ReportsProps> = ({ transactions, config }) => {
  const activeTransactions = transactions.filter(t => t.status === 'active');
  const income = activeTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = activeTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const getCategoryStats = (type: 'income' | 'expense') => {
    const stats: Record<string, number> = {};
    activeTransactions
      .filter(t => t.type === type)
      .forEach(t => {
        stats[t.category] = (stats[t.category] || 0) + t.amount;
      });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  };

  const incomeStats = getCategoryStats('income');
  const expenseStats = getCategoryStats('expense');

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
        <span>📊</span> ລາຍງານ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-emerald-500">
          <div className="text-4xl mb-3">💰</div>
          <p className="text-sm text-slate-500 mb-2">ລາຍຮັບທັງໝົດ</p>
          <p className="text-3xl font-bold text-emerald-500">{formatNumber(income)}</p>
          <p className="text-xs mt-2 text-slate-400">{config.currency}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-red-500">
          <div className="text-4xl mb-3">💸</div>
          <p className="text-sm text-slate-500 mb-2">ລາຍຈ່າຍທັງໝົດ</p>
          <p className="text-3xl font-bold text-red-500">{formatNumber(expense)}</p>
          <p className="text-xs mt-2 text-slate-400">{config.currency}</p>
        </div>
        
        <div className={`bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 ${balance >= 0 ? 'border-blue-500' : 'border-red-500'}`}>
          <div className="text-4xl mb-3">📈</div>
          <p className="text-sm text-slate-500 mb-2">ກຳໄລສຸດທິ</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
            {formatNumber(balance)}
          </p>
          <p className="text-xs mt-2 text-slate-400">{config.currency}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-600">
            <span>📥</span> ລາຍຮັບຕາມໝວດໝູ່
          </h3>
          {incomeStats.length === 0 ? (
            <p className="text-center py-12 opacity-50">ຍັງບໍ່ມີຂໍ້ມູນ</p>
          ) : (
            <div className="space-y-4">
              {incomeStats.map(([cat, amt]) => {
                const percentage = ((amt / income) * 100).toFixed(1);
                return (
                  <div key={cat} className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="font-bold text-emerald-600">{formatNumber(amt)}</span>
                    </div>
                    <div className="w-full bg-emerald-200/50 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-xs mt-1 text-emerald-600/70 text-right">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
            <span>📤</span> ລາຍຈ່າຍຕາມໝວດໝູ່
          </h3>
          {expenseStats.length === 0 ? (
            <p className="text-center py-12 opacity-50">ຍັງບໍ່ມີຂໍ້ມູນ</p>
          ) : (
            <div className="space-y-4">
              {expenseStats.map(([cat, amt]) => {
                const percentage = ((amt / expense) * 100).toFixed(1);
                return (
                  <div key={cat} className="p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-700">{cat}</span>
                      <span className="font-bold text-red-600">{formatNumber(amt)}</span>
                    </div>
                    <div className="w-full bg-red-200/50 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <p className="text-xs mt-1 text-red-600/70 text-right">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;