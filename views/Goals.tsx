
import React, { useState } from 'react';
import { Target, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Goal } from '../types';

interface GoalsProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id'>) => void;
  onDelete: (id: string) => void;
  balance: number;
}

const Goals: React.FC<GoalsProps> = ({ goals, onAdd, onDelete, balance }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !target) return;
    onAdd({
      name,
      targetAmount: parseFloat(target),
      currentAmount: 0 // In this simple version, we track the target vs total balance
    });
    setIsAdding(false);
    setName('');
    setTarget('');
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Savings Goals</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Track what you're working towards.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"
        >
          <Plus size={24} />
        </button>
      </header>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-emerald-500/20 shadow-xl mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold">New Saving Goal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="What are you saving for? (e.g. Laptop)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none border border-transparent focus:border-emerald-500"
              />
              <input 
                type="number" 
                placeholder="Target Amount"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none border border-transparent focus:border-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold">Create Goal</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          // Logic: progress is current balance relative to goal
          const progress = Math.min((balance / goal.targetAmount) * 100, 100);
          const isCompleted = progress >= 100;

          return (
            <div key={goal.id} className={`p-6 rounded-3xl border transition-all ${isCompleted ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                  <Target size={24} />
                </div>
                <button onClick={() => onDelete(goal.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold mb-1">{goal.name}</h3>
              <p className="text-sm text-gray-500 mb-6">Target: ${goal.targetAmount.toLocaleString()}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className={isCompleted ? 'text-emerald-600' : 'text-gray-400'}>
                    {isCompleted ? 'Goal Reached!' : `${progress.toFixed(0)}% Complete`}
                  </span>
                  <span className="text-gray-500">${balance.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {!isCompleted && (
                <div className="mt-6 flex items-center gap-2 text-sm text-blue-600 font-medium cursor-pointer">
                  See how to save faster <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}

        {goals.length === 0 && !isAdding && (
          <div className="md:col-span-2 text-center py-20 bg-gray-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-800">
             <div className="inline-block p-4 rounded-full bg-white dark:bg-slate-900 mb-4 shadow-sm text-emerald-500">
               <Target size={32} />
             </div>
             <h3 className="text-lg font-bold">No Goals Yet</h3>
             <p className="text-gray-500 max-w-xs mx-auto mt-2">Set savings goals for things you want and track your progress automatically based on your balance.</p>
             <button 
               onClick={() => setIsAdding(true)}
               className="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20"
              >
               Set My First Goal
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
