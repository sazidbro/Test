
import React, { useMemo } from 'react';
import { Transaction, TransactionType, Budget } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

interface AnalyticsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions, budgets }) => {
  const chartData = useMemo(() => {
    // Last 6 months trend
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        income: 0,
        expense: 0
      });
    }

    transactions.forEach(t => {
      const td = new Date(t.date);
      const mIdx = months.findIndex(m => m.month === td.getMonth() && m.year === td.getFullYear());
      if (mIdx !== -1) {
        if (t.type === TransactionType.INCOME) months[mIdx].income += t.amount;
        else months[mIdx].expense += t.amount;
      }
    });

    return months;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        data[t.category] = (data[t.category] || 0) + t.amount;
      });
    
    return Object.entries(data).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Financial Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Deep dive into your spending habits.</p>
      </header>

      {/* Income vs Expense Trend */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Income vs Expense Trend</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415510" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category Rankings */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Spending by Category</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#33415510" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={80} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Stats Summary */}
        <section className="bg-emerald-500 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/20 flex flex-col justify-center">
          <h3 className="text-emerald-100 text-sm font-medium mb-2 uppercase tracking-wider">Top Saving Insight</h3>
          <p className="text-xl font-bold leading-tight">
            You've spent the most on <span className="underline decoration-white/30">{categoryData[0]?.name || 'nothing'}</span> this month.
          </p>
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
            <div>
              <div className="text-emerald-100 text-xs mb-1">Avg Expense</div>
              <div className="text-2xl font-bold">${(chartData.reduce((a,b) => a + b.expense, 0) / 6).toFixed(0)}</div>
            </div>
            <div>
              <div className="text-emerald-100 text-xs mb-1">Savings Goal Progress</div>
              <div className="text-2xl font-bold">64%</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
