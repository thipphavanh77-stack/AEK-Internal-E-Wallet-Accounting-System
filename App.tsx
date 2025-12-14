import React, { useState, useEffect } from 'react';
import { Transaction, ViewState, TransactionType } from './types';
import { loadTransactions, saveTransactions, DEFAULT_CONFIG } from './services/data';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import TransactionModal from './components/TransactionModal';
import { Menu, User as UserIcon } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('income');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const data = loadTransactions();
    setTransactions(data);
  }, []);

  const handleSaveTransaction = (data: Omit<Transaction, 'id' | 'status' | 'created_at' | 'created_by'>) => {
    let updatedTransactions: Transaction[];
    
    if (editingTransaction) {
      updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id 
          ? { ...t, ...data } 
          : t
      );
    } else {
      const newTransaction: Transaction = {
        ...data,
        id: Date.now().toString(),
        status: 'active',
        created_at: new Date().toISOString(),
        created_by: 'ຜູ້ດູແລລະບົບ'
      };
      updatedTransactions = [...transactions, newTransaction];
    }
    
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm("ທ່ານຕ້ອງການຍົກເລີກລາຍການນີ້ແມ່ນບໍ?")) {
      const updated = transactions.map(t => 
        t.id === id ? { ...t, status: 'cancelled' as const } : t
      );
      setTransactions(updated);
      saveTransactions(updated);
    }
  };

  const openAddModal = (type: TransactionType) => {
    setModalType(type);
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (t: Transaction) => {
    setModalType(t.type);
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} config={DEFAULT_CONFIG} />;
      case 'income':
        return (
          <TransactionList 
            type="income" 
            transactions={transactions} 
            onAdd={() => openAddModal('income')}
            onEdit={openEditModal}
            onDelete={handleDeleteTransaction}
            config={DEFAULT_CONFIG}
          />
        );
      case 'expense':
        return (
          <TransactionList 
            type="expense" 
            transactions={transactions} 
            onAdd={() => openAddModal('expense')}
            onEdit={openEditModal}
            onDelete={handleDeleteTransaction}
            config={DEFAULT_CONFIG}
          />
        );
      case 'reports':
        return <Reports transactions={transactions} config={DEFAULT_CONFIG} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-lao">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        config={DEFAULT_CONFIG}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px] transition-all duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-20 px-4 sm:px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 lg:hidden text-slate-600"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="font-medium text-sm text-slate-800">ຜູ້ດູແລລະບົບ</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
              <UserIcon size={20} />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <TransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTransaction}
        editingTransaction={editingTransaction}
        type={modalType}
      />
    </div>
  );
};

export default App;