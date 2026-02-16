
import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Calendar, Tag } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL');

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || t.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, filterType]);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Monitor your activity over time.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search notes or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Types</option>
            <option value={TransactionType.INCOME}>Income</option>
            <option value={TransactionType.EXPENSE}>Expense</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(t => (
          <div 
            key={t.id} 
            className="group relative bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === TransactionType.INCOME ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {t.type === TransactionType.INCOME ? <PlusCircleIcon /> : <MinusCircleIcon />}
              </div>
              <div>
                <div className="font-bold flex items-center gap-2">
                  {t.category}
                  {t.note && <span className="text-xs font-normal text-gray-400 bg-gray-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">{t.note}</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(t.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Tag size={12} /> {t.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`text-lg font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-red-500'}`}>
                {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
              </div>
              <button 
                onClick={() => onDelete(t.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
            <p className="text-gray-400">No matching transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PlusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const MinusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
  </svg>
);

export default Transactions;
