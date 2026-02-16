
import React from 'react';
import { 
  Moon, Sun, Download, Upload, Shield, 
  FileText, Trash2, Github, AlertTriangle, Smartphone
} from 'lucide-react';
import { AppState } from '../types';

interface SettingsProps {
  state: AppState;
  onToggleTheme: () => void;
  onImport: (data: AppState) => void;
  onUpdateBudget: (budgets: AppState['budgets']) => void;
}

const Settings: React.FC<SettingsProps> = ({ state, onToggleTheme, onImport, onUpdateBudget }) => {
  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImport(data);
        alert('Data imported successfully!');
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const generateReport = () => {
    let csv = "Date,Type,Category,Amount,Note\n";
    state.transactions.forEach(t => {
      csv += `${t.date},${t.type},${t.category},${t.amount},"${t.note}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintrack_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Settings & Configuration</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your account and data.</p>
      </header>

      <div className="space-y-6">
        {/* Installation Instructions */}
        <section className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Smartphone size={20} className="text-emerald-600" /> How to Install
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">For Android (Chrome):</p>
              <p className="text-gray-600 dark:text-gray-400">Tap the three dots (⋮) in the top right and select "Install App" or "Add to Home Screen".</p>
            </div>
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">For iPhone (Safari):</p>
              <p className="text-gray-600 dark:text-gray-400">Tap the Share icon (⎙) at the bottom and select "Add to Home Screen".</p>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sun size={20} className="text-amber-500" /> Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dark Mode</div>
              <div className="text-sm text-gray-500">Enable high contrast dark theme</div>
            </div>
            <button 
              onClick={onToggleTheme}
              className={`w-14 h-8 rounded-full relative transition-colors ${state.theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-200'}`}
            >
              <div className={`absolute top-1 transition-all h-6 w-6 rounded-full bg-white shadow-sm ${state.theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield size={20} className="text-blue-500" /> Data & Security
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Backup Data</div>
                <div className="text-sm text-gray-500">Download a JSON file of all data</div>
              </div>
              <button onClick={exportData} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                <Download size={20} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Restore Backup</div>
                <div className="text-sm text-gray-500">Import your transactions and settings</div>
              </div>
              <label className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer">
                <Upload size={20} />
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Monthly Report</div>
                <div className="text-sm text-gray-500">Export detailed CSV analysis</div>
              </div>
              <button onClick={generateReport} className="p-3 bg-gray-50 dark:bg-slate-800 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">
                <FileText size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/20">
          <h2 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} /> Danger Zone
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-red-700 dark:text-red-400">Clear All Data</div>
              <div className="text-sm text-red-600/70">This action is permanent and cannot be undone.</div>
            </div>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to delete everything?')) {
                  localStorage.removeItem('fintrack_data');
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
            >
              Reset App
            </button>
          </div>
        </section>

        {/* Footer info */}
        <div className="text-center pt-8 space-y-2">
          <p className="text-sm font-bold text-gray-400">FinTrack Personal Pro v1.0.0</p>
          <div className="flex justify-center gap-4 text-gray-400">
             <Github size={20} />
             <FileText size={20} />
          </div>
          <p className="text-xs text-gray-400">Developed specifically for students seeking financial freedom.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
