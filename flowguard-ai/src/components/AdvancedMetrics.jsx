import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap, Target, AlertCircle } from 'lucide-react';

export default function AdvancedMetrics({ stats }) {
  const metrics = [
    {
      title: 'System Performance',
      subtitle: 'Real-time Processing',
      items: [
        { label: 'Transactions/sec', value: '1,247', unit: 'txn/s', trend: 'up' },
        { label: 'Avg Latency', value: '2.3', unit: 'ms', trend: 'down' },
        { label: 'CPU Usage', value: '34', unit: '%', trend: 'stable' },
        { label: 'Memory Usage', value: '2.1', unit: 'GB', trend: 'stable' }
      ]
    },
    {
      title: 'Detection Metrics',
      subtitle: 'AML Performance',
      items: [
        { label: 'True Positives', value: '24', unit: '', trend: 'up' },
        { label: 'False Positives', value: '2', unit: '', trend: 'down' },
        { label: 'Detection Rate', value: '96.5', unit: '%', trend: 'up' },
        { label: 'Precision Score', value: '97.2', unit: '%', trend: 'up' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {metrics.map((section, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl"
        >
          <div className="mb-4">
            <h4 className="text-sm font-bold text-neon-cyan">{section.title}</h4>
            <p className="text-xs text-slate-500">{section.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {section.items.map((item, i) => (
              <div key={i} className="p-2 bg-slate-900/50 rounded-lg">
                <p className="text-xs text-slate-500">{item.label}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-bold text-white">{item.value}</span>
                  {item.trend === 'up' && <TrendingUp className="w-3 h-3 text-acid-green" />}
                  {item.trend === 'down' && <TrendingDown className="w-3 h-3 text-neon-cyan" />}
                  {item.trend === 'stable' && <Activity className="w-3 h-3 text-warning-amber" />}
                </div>
                {item.unit && <p className="text-[10px] text-slate-600 mt-1">{item.unit}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
