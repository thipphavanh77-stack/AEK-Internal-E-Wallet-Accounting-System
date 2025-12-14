import React from 'react';
import { Transaction, TransactionType, AppConfig } from '../types';
import { formatNumber, formatDate } from '../services/data';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface TransactionListProps {
  type: TransactionType;
  transactions: Transaction[];
  onAdd: () => void;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  config: AppConfig;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  type, 
  transactions, 
  onAdd, 
  onEdit, 
  onDelete,
  config
}) => {
  const filtered = transactions
    .filter(t => t.type === type && t.status === 'active')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const title = type === 'income' ? 'ລາຍຮັບ' : 'ລາຍຈ່າຍ';
  const themeColor = type === 'income' ? config.secondary_color : config.danger_color;
  const themeBg = type === 'income' ? 'bg-emerald-500' : 'bg-red-500';
  const themeText = type === 'income' ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <span className={type === 'income' ? 'text-emerald-500' : 'text-red-500'}>
            {type === 'income' ? '📥' : '📤'}
          </span> 
          {title}
        </h2>
        <button 
          onClick={onAdd}
          className={`${themeBg} text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2`}
        >
          <Plus size={20} />
          <span>ເພີ່ມ{title}ໃໝ່</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <div className="text-7xl mb-4 grayscale opacity-20">{type === 'income' ? '📥' : '📤'}</div>
          <p className="text-xl font-medium text-slate-400">ຍັງບໍ່ມີ{title}</p>
          <p className="text-sm mt-2 text-slate-300">ຄລິກປຸ່ມດ້ານເທິງເພື່ອເພີ່ມ{title}ໃໝ່</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: `${themeColor}15`, borderBottomColor: themeColor }} className="border-b-2">
                  <th className="text-left py-4 px-5 font-semibold text-slate-700">ວັນທີ</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700">{type === 'income' ? 'ຜູ້ໂອນ' : 'ຈ່າຍໃຫ້'}</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700">ໝວດໝູ່</th>
                  <th className="text-left py-4 px-5 font-semibold text-slate-700">ວິທີການ</th>
                  <th className="text-right py-4 px-5 font-semibold text-slate-700">ຈຳນວນເງິນ</th>
                  <th className="text-center py-4 px-5 font-semibold text-slate-700">ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5 text-slate-600">{formatDate(t.date)}</td>
                    <td className="py-4 px-5 font-medium text-slate-700">{t.name}</td>
                    <td className="py-4 px-5">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600">{t.payment_method}</td>
                    <td className={`py-4 px-5 text-right font-bold text-lg ${themeText}`}>
                      {formatNumber(t.amount)}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex gap-2 justify-center">
                        <button 
                          onClick={() => onEdit(t)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="ແກ້ໄຂ"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="ລຶບ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;