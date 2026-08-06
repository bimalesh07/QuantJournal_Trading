import React, { useState } from 'react';
import { X, Layers, Plus, Trash2, Loader2 } from 'lucide-react';

export default function StrategyManagerModal({ isOpen, onClose, strategies = [], onCreateStrategy, onDeleteStrategy }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    try {
      setSubmitting(true);
      await onCreateStrategy({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Failed to submit new strategy:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-[#10141D] w-full max-w-xl border border-slate-700/80 my-8 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#151921]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Strategy Manager</h3>
              <p className="text-xs text-slate-400">Manage trading models and setup methodologies</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Create New Strategy Form */}
          <form onSubmit={handleCreate} className="bg-[#151921] p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Add New Strategy</h4>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                required
                placeholder="Strategy Name (e.g., Fair Value Gap, ICT, S/R Bounce)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0B0E14] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none font-medium"
              />
              <input
                type="text"
                placeholder="Brief Strategy Description (Optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0B0E14] text-xs sm:text-sm text-white px-3.5 py-2.5 rounded-lg border border-slate-700 focus:border-purple-500 focus:outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-purple-400 hover:bg-purple-300 disabled:opacity-50 rounded-lg shadow-md shadow-purple-500/20 transition-all cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{submitting ? 'Creating...' : 'Add Strategy'}</span>
            </button>
          </form>

          {/* List of Strategies */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Existing Strategies ({strategies.length})</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {strategies.length > 0 ? (
                strategies.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-[#151921] border border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{s.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 font-mono font-medium border border-purple-500/20">
                          {s.trade_count || 0} trades
                        </span>
                      </div>
                      {s.description && (
                        <p className="text-xs text-slate-400 mt-1">{s.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteStrategy(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                      title="Delete Strategy"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs sm:text-sm text-slate-500 font-mono">
                  No custom strategies created yet.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
