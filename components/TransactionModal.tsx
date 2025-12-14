import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../services/data';
import { X } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'status' | 'created_at' | 'created_by'>) => void;
  editingTransaction: Transaction | null;
  type: TransactionType;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingTransaction, 
  type 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    name: '',
    category: '',
    payment_method: PAYMENT_METHODS[0],
    reference: '',
    note: ''
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        amount: editingTransaction.amount.toString(),
        name: editingTransaction.name,
        category: editingTransaction.category,
        payment_method: editingTransaction.payment_method,
        reference: editingTransaction.reference || '',
        note: editingTransaction.note || ''
      });
    } else {
      const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        name: '',
        category: categories[0],
        payment_method: PAYMENT_METHODS[0],
        reference: '',
        note: ''
      });
    }
  }, [editingTransaction, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      type,
    });
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const headerColor = type === 'income' ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-fade-in-up">
        <div className={`p-6 text-white flex justify-between items-center ${headerColor}`}>
          <h2 className="text-2xl font-bold">
            {editingTransaction ? '✏️ ແກ້ໄຂ' : (type === 'income' ? '📥 ເພີ່ມລາຍຮັບ' : '📤 ເພີ່ມລາຍຈ່າຍ')}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ວັນທີ:</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ຈຳນວນເງິນ:</label>
              <input 
                type="number" 
                step="0.01" 
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-mono"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{type === 'income' ? 'ຜູ້ໂອນ:' : 'ຈ່າຍໃຫ້:'}</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ໝວດໝູ່:</label>
              <select 
                required
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ວິທີການຊຳລະ:</label>
              <select 
                required
                value={formData.payment_method}
                onChange={e => setFormData({...formData, payment_method: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
              >
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">ເລກທີ່ອ້າງອີງ:</label>
              <input 
                type="text" 
                value={formData.reference}
                onChange={e => setFormData({...formData, reference: e.target.value})}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">ໝາຍເຫດ:</label>
            <textarea 
              rows={3}
              value={formData.note}
              onChange={e => setFormData({...formData, note: e.target.value})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-slate-200 font-medium hover:bg-slate-50 transition-colors text-slate-600"
            >
              ຍົກເລີກ
            </button>
            <button 
              type="submit"
              className={`px-6 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all ${headerColor}`}
            >
              ບັນທຶກ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;