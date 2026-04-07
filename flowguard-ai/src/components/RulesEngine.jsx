import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RulesEngine() {
  const [rules] = useState([
    {
      id: 1,
      name: 'Structuring Threshold',
      description: 'Flag txns just below 2L threshold',
      trigger: 'Amount between 180K-199K',
      action: 'Flag & Review',
      enabled: true,
      matches: 24
    },
    {
      id: 2,
      name: 'Multiple Rapid Transfers',
      description: 'Detect multiple transfers within 5 mins',
      trigger: '5+ transfers in 5 minutes',
      action: 'Alert & Escalate',
      enabled: true,
      matches: 8
    },
    {
      id: 3,
      name: 'PEP Transaction Detection',
      description: 'Screen against PEP/KYM database',
      trigger: 'Match with PEP database',
      action: 'Immediate Freeze & Review',
      enabled: true,
      matches: 3
    },
    {
      id: 4,
      name: 'Sanctions Screening',
      description: 'Check against OFAC list',
      trigger: 'Match with sanctions list',
      action: 'Auto-Reject',
      enabled: true,
      matches: 1
    },
    {
      id: 5,
      name: 'Unusually High Amount',
      description: 'Alert on amounts > account average by 5x',
      trigger: 'Amount > 5x average',
      action: 'Manual Review',
      enabled: true,
      matches: 12
    }
  ]);

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h4 className="text-sm font-bold text-neon-cyan">Custom Alert Rules</h4>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="p-2 rounded-lg bg-acid-green/20 border border-acid-green/30 text-acid-green hover:bg-acid-green/30 transition-all"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </motion.div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {rules.map((rule, i) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-neon-cyan/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ToggleLeft className={`w-4 h-4 ${rule.enabled ? 'text-acid-green' : 'text-slate-600'}`} />
                  <h5 className="font-bold text-white text-sm">{rule.name}</h5>
                </div>
                <p className="text-xs text-slate-400">{rule.description}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-1.5 rounded bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30"
                >
                  <Edit2 className="w-3 h-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="p-1.5 rounded bg-threat-critical/20 text-threat-critical hover:bg-threat-critical/30"
                >
                  <Trash2 className="w-3 h-3" />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 ml-6 text-xs">
              <div>
                <span className="text-slate-500">Trigger:</span>
                <p className="text-slate-300 font-mono text-[10px] mt-0.5">{rule.trigger}</p>
              </div>
              <div>
                <span className="text-slate-500">Action:</span>
                <p className="text-acid-green font-mono text-[10px] mt-0.5">{rule.action}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Matches:</span>
                <p className="text-neon-cyan font-bold mt-0.5">{rule.matches}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Rule Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="w-full p-3 bg-gradient-to-r from-neon-cyan/10 to-acid-green/10 border border-neon-cyan/50 rounded-lg text-neon-cyan font-bold text-sm hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Create New Rule
      </motion.button>
    </div>
  );
}
