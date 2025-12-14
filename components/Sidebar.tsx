import React from 'react';
import { Home, ArrowDownCircle, ArrowUpCircle, PieChart, Settings, Users, Folder, Lock, FileText, User } from 'lucide-react';
import { ViewState, AppConfig } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose, config }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'ແດຊບອດ' },
    { id: 'income', icon: ArrowDownCircle, label: 'ລາຍຮັບ' },
    { id: 'expense', icon: ArrowUpCircle, label: 'ລາຍຈ່າຍ' },
    { id: 'reports', icon: PieChart, label: 'ລາຍງານ' },
  ];

  const disabledItems = [
    { icon: Settings, label: 'ການຈັດການ' },
    { icon: Users, label: 'ຈັດການຜູ້ໃຊ້' },
    { icon: Folder, label: 'ໝວດໝູ່' },
    { icon: Lock, label: 'ປິດງວດບັນຊີ' },
    { icon: FileText, label: 'Audit Log' },
  ];

  const sidebarClass = `
    fixed inset-y-0 left-0 z-40 w-[260px] transform transition-transform duration-300 ease-in-out bg-slate-900 text-white shadow-2xl
    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    bg-gradient-to-b from-slate-800 to-slate-900
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClass}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            💼 <span>{config.company_name}</span>
          </h1>
          <p className="text-sm text-white/60 mt-1">{config.dashboard_title}</p>
        </div>

        <nav className="py-4 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onChangeView(item.id as ViewState);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-blue-500/20 text-white border-l-4 border-blue-500' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-400' : 'text-white/50 group-hover:text-white'}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          <div className="my-4 border-t border-white/10 mx-4" />

          {disabledItems.map((item, index) => (
            <div
              key={index}
              className="w-full flex items-center px-4 py-3 text-white/30 cursor-not-allowed"
            >
              <item.icon className="w-5 h-5 mr-3 opacity-50" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">ຜູ້ດູແລລະບົບ</p>
              <p className="text-white/60 text-xs">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;