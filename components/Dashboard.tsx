import React from 'react';
import { Transaction, AppConfig } from '../types';
import { formatNumber, formatDate } from '../services/data';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  config: AppConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, config }) => {
  const activeTransactions = transactions.filter(t => t.status === 'active');
  
  // Calculate Totals
  const income = activeTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expense = activeTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = income - expense;

  // Calculate Today's
  const today = new Date().toISOString().split('T')[0];
  const todayTrans = activeTransactions.filter(t => t.date === today);
  const todayIncome = todayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = todayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Calculate Monthly
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthTrans = activeTransactions.filter(t => t.date >= monthStart);
  const monthIncome = monthTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = monthTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const monthProfit = monthIncome - monthExpense;

  // Recent Transactions
  const recentTransactions = [...activeTransactions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  // Chart Data (Last 12 Months)
  const getChartData = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toISOString().slice(0, 7);
      const monthName = d.toLocaleDateString('lo-LA', { month: 'short' });
      
      const monthT = activeTransactions.filter(t => t.date.startsWith(monthKey));
      const inc = monthT.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const exp = monthT.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      months.push({ name: monthName, income: inc, expense: exp });
    }
    return months;
  };

  const chartData = getChartData();

  const StatCard = ({ title, value, subValue, icon: Icon, color, headerColor }: any) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300">
      <div className="h-1.5 w-full" style={{ background: headerColor }}></div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{title}</p>
            <p className="text-2xl font-bold" style={{ color: headerColor }}>{value}</p>
            <p className="text-xs mt-2 text-slate-400">{subValue}</p>
          </div>
          <div className="p-3 rounded-full bg-slate-50">
            <Icon size={24} className="opacity-50" color={color} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="ຍອດເງິນຄົງເຫຼືອ"
          value={formatNumber(balance)}
          subValue={config.currency}
          icon={Wallet}
          color={config.primary_color}
          headerColor={config.primary_color}
        />
        <StatCard 
          title="ລາຍຮັບທັງໝົດ"
          value={formatNumber(income)}
          subValue={`ວັນນີ້: ${formatNumber(todayIncome)}`}
          icon={TrendingUp}
          color={config.secondary_color}
          headerColor={config.secondary_color}
        />
        <StatCard 
          title="ລາຍຈ່າຍທັງໝົດ"
          value={formatNumber(expense)}
          subValue={`ວັນນີ້: ${formatNumber(todayExpense)}`}
          icon={TrendingDown}
          color={config.danger_color}
          headerColor={config.danger_color}
        />
        <StatCard 
          title="ກຳໄລສຸດທິເດືອນນີ້"
          value={formatNumber(monthProfit)}
          subValue={config.currency}
          icon={DollarSign}
          color={monthProfit >= 0 ? config.secondary_color : config.danger_color}
          headerColor={monthProfit >= 0 ? config.secondary_color : config.danger_color}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
          <span>📊</span> ກາຟລາຍຮັບ-ລາຍຈ່າຍ 12 ເດືອນ
        </h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                formatter={(value: number) => formatNumber(value)}
              />
              <Bar dataKey="income" name="ລາຍຮັບ" fill={config.secondary_color} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="ລາຍຈ່າຍ" fill={config.danger_color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-700">
          <span>📋</span> ລາຍການຫຼ້າສຸດ
        </h2>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-12 opacity-50">
            <p className="text-lg">ຍັງບໍ່ມີລາຍການ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-100">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">ວັນທີ</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">ປະເພດ</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">ລາຍລະອຽດ</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">ໝວດໝູ່</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-600">ຈຳນວນເງິນ</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(t => (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors">
                    <td className="py-4 px-4 text-slate-600">{formatDate(t.date)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium
                        ${t.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
                      `}>
                        {t.type === 'income' ? '📥 ລາຍຮັບ' : '📤 ລາຍຈ່າຍ'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">{t.name}</td>
                    <td className="py-4 px-4 text-slate-600">{t.category}</td>
                    <td className={`py-4 px-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatNumber(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;