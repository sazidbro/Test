
import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Plus, ChevronRight, Smartphone } from 'lucide-react';
import { AppState, TransactionType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardProps {
  state: AppState;
  onAddClick: () => void;
  installPrompt: any;
  onInstallClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onAddClick, installPrompt, onInstallClick }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthData = useMemo(() => {
    return state.transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [state.transactions, currentMonth, currentYear]);

  const stats = useMemo(() => {
    const income = currentMonthData
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = currentMonthData
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    const savingsPercent = income > 0 ? (balance / income) * 100 : 0;

    return { income, expense, balance, savingsPercent };
  }, [currentMonthData]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    currentMonthData
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        breakdown[t.category] = (breakdown[t.category] || 0) + t.amount;
      });
    return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
  }, [currentMonthData]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Install Banner */}
      {installPrompt && (
        <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg flex items-center justify-between mb-6 animate-pulse">
          <div className="flex items-center gap-3">
            <Smartphone size={24} />
            <div>
              <div className="font-bold text-sm">Install App</div>
              <div className="text-xs text-emerald-100">Add to your home screen for offline use</div>
            </div>
          </div>
          <button 
            onClick={onInstallClick}
            className="bg-white text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
          >
            Get App
          </button>
        </div>
      )}

      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Hello, Abbu! 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back to your finances.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:bg-emerald-600 transition-all"
        >
          <Plus size={20} /> Add
        </button>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Current Balance" 
          value={stats.balance} 
          icon={<Wallet className="text-blue-500" />} 
          color="blue"
          type="currency"
        />
        <StatCard 
          title="Total Income" 
          value={stats.income} 
          icon={<TrendingUp className="text-emerald-500" />} 
          color="emerald"
          type="currency"
        />
        <StatCard 
          title="Total Expense" 
          value={stats.expense} 
          icon={<TrendingDown className="text-red-500" />} 
          color="red"
          type="currency"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenses Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          <div className="h-64">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No expense data this month
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryBreakdown.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Progress */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Budget Limits</h2>
          </div>
          <div className="space-y-4">
            {state.budgets.map(budget => {
              const spent = currentMonthData
                .filter(t => t.type === TransactionType.EXPENSE && t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
              const progress = Math.min((spent / budget.limit) * 100, 100);
              const color = progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-amber-500' : 'bg-emerald-500';

              return (
                <div key={budget.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-gray-500">{spent.toLocaleString()} / {budget.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <a href="#/transactions" className="text-emerald-500 text-sm font-medium flex items-center gap-1">
            See All <ChevronRight size={16} />
          </a>
        </div>
        <div className="space-y-4">
          {state.transactions.slice(0, 5).map(t => (
            <div key={t.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === TransactionType.INCOME ? <Plus size={20} /> : <ChevronRight size={20} className="rotate-90" />}
                </div>
                <div>
                  <div className="font-medium">{t.category}</div>
                  <div className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className={`font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
              </div>
            </div>
          ))}
          {state.transactions.length === 0 && (
            <div className="py-10 text-center text-gray-400">No transactions recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, type }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl bg-${color}-50 dark:bg-${color}-900/20`}>
        {icon}
      </div>
      <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-50 dark:bg-slate-800 text-gray-500">Monthly</div>
    </div>
    <div className="text-2xl font-bold">
      {type === 'currency' ? '$' : ''}{value.toLocaleString()}
    </div>
    <div className="text-sm text-gray-500 mt-1">{title}</div>
  </div>
);

export default Dashboard;
