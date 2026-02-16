
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { TransactionType, ExpenseCategory } from '../types';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (transaction: any) => void;
  theme: 'light' | 'dark';
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit, theme }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(ExpenseCategory.FOOD);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      date,
      note
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${type === TransactionType.EXPENSE ? 'bg-white dark:bg-slate-700 shadow-sm text-red-500' : 'text-gray-500'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${type === TransactionType.INCOME ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-500' : 'text-gray-500'}`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 outline-none font-bold text-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 outline-none"
            >
              {type === TransactionType.EXPENSE ? (
                Object.values(ExpenseCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Gift">Gift</option>
                  <option value="Others">Others</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Note (Optional)</label>
            <textarea 
              placeholder="What was this for?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 outline-none resize-none"
              rows={2}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/30 transition-all mt-4"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
