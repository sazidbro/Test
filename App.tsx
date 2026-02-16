
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  BarChart3, 
  Target, 
  Settings as SettingsIcon,
  PlusCircle,
  History
} from 'lucide-react';

import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Analytics from './views/Analytics';
import Goals from './views/Goals';
import Settings from './views/Settings';
import TransactionForm from './components/TransactionForm';

import { AppState, Transaction, TransactionType } from './types';

const INITIAL_STATE: AppState = {
  transactions: [],
  budgets: [
    { category: 'Food', limit: 5000 },
    { category: 'Transport', limit: 2000 },
    { category: 'Study', limit: 1000 },
    { category: 'Shopping', limit: 2000 },
  ],
  goals: [],
  theme: 'light'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('fintrack_data');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    localStorage.setItem('fintrack_data', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-slate-950', 'text-white');
      document.body.classList.remove('bg-gray-50', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-gray-50', 'text-gray-900');
      document.body.classList.remove('bg-slate-950', 'text-white');
    }
  }, [state]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: crypto.randomUUID() };
    setState(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
  };

  const deleteTransaction = (id: string) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const updateBudget = (budgets: AppState['budgets']) => {
    setState(prev => ({ ...prev, budgets }));
  };

  const addGoal = (goal: Omit<AppState['goals'][0], 'id'>) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: crypto.randomUUID() }]
    }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const importData = (data: AppState) => {
    setState(data);
  };

  return (
    <Router>
      <div className={`min-h-screen pb-20 md:pb-0 md:pl-20 transition-colors duration-300 ${state.theme === 'dark' ? 'dark text-white' : 'text-gray-900'}`}>
        {/* Desktop Sidebar */}
        <nav className={`fixed left-0 top-0 h-full w-20 hidden md:flex flex-col items-center py-8 border-r transition-colors ${state.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className="mb-10 text-emerald-500 font-bold text-xl">FP</div>
          <div className="flex flex-col gap-8 flex-1">
            <NavItem to="/" icon={<LayoutDashboard size={24} />} />
            <NavItem to="/transactions" icon={<History size={24} />} />
            <NavItem to="/analytics" icon={<BarChart3 size={24} />} />
            <NavItem to="/goals" icon={<Target size={24} />} />
          </div>
          <NavItem to="/settings" icon={<SettingsIcon size={24} />} />
        </nav>

        {/* Mobile Bottom Bar */}
        <nav className={`fixed bottom-0 left-0 w-full h-16 md:hidden flex justify-around items-center border-t z-50 transition-colors ${state.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <NavItem to="/" icon={<LayoutDashboard size={22} />} />
          <NavItem to="/transactions" icon={<History size={22} />} />
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center -mt-8 shadow-lg shadow-emerald-500/30"
          >
            <PlusCircle size={28} />
          </button>
          <NavItem to="/analytics" icon={<BarChart3 size={22} />} />
          <NavItem to="/settings" icon={<SettingsIcon size={22} />} />
        </nav>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard state={state} onAddClick={() => setIsAddModalOpen(true)} installPrompt={deferredPrompt} onInstallClick={handleInstallClick} />} />
            <Route path="/transactions" element={<Transactions transactions={state.transactions} onDelete={deleteTransaction} />} />
            <Route path="/analytics" element={<Analytics transactions={state.transactions} budgets={state.budgets} />} />
            <Route path="/goals" element={<Goals goals={state.goals} onAdd={addGoal} onDelete={deleteGoal} balance={useMemo(() => state.transactions.reduce((acc, t) => t.type === TransactionType.INCOME ? acc + t.amount : acc - t.amount, 0), [state.transactions])} />} />
            <Route path="/settings" element={<Settings state={state} onToggleTheme={toggleTheme} onImport={importData} onUpdateBudget={updateBudget} />} />
          </Routes>
        </main>

        {/* Add Transaction Modal */}
        {isAddModalOpen && (
          <TransactionForm 
            onClose={() => setIsAddModalOpen(false)} 
            onSubmit={(t) => {
              addTransaction(t);
              setIsAddModalOpen(false);
            }} 
            theme={state.theme}
          />
        )}
      </div>
    </Router>
  );
};

const NavItem = ({ to, icon }: { to: string, icon: React.ReactNode }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `p-2 rounded-xl transition-all ${isActive ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-emerald-500'}`}
  >
    {icon}
  </NavLink>
);

export default App;
