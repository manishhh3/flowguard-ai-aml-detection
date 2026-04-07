import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle2, Clock, Target, Zap } from 'lucide-react';

export default function AnalyticsDashboard({ stats, riskScore, transactions }) {
  const getRiskLevel = (score) => {
    if (score < 30) return { level: 'LOW', color: 'text-acid-green', bg: 'bg-acid-green/10' };
    if (score < 60) return { level: 'MEDIUM', color: 'text-warning-amber', bg: 'bg-warning-amber/10' };
    return { level: 'CRITICAL', color: 'text-threat-critical', bg: 'bg-threat-critical/10' };
  };

  const riskLevel = getRiskLevel(riskScore);
  const flaggedCount = transactions.filter(t => t.status === 'FLAGGED').length;
  const detectionRate = ((flaggedCount / stats.totalProcessed) * 100).toFixed(2);

  const statCards = [
    {
      icon: TrendingUp,
      label: 'Detection Rate',
      value: `${detectionRate}%`,
      change: '+2.4%',
      color: 'text-acid-green'
    },
    {
      icon: AlertCircle,
      label: 'False Positives',
      value: stats.falsePositives,
      change: '-0.3%',
      color: 'text-warning-amber'
    },
    {
      icon: Clock,
      label: 'Avg Process Time',
      value: stats.avgProcessTime,
      change: '~2.3ms',
      color: 'text-neon-cyan'
    },
    {
      icon: CheckCircle2,
      label: 'Accuracy',
      value: `${stats.accuracy}%`,
      change: '+1.2%',
      color: 'text-acid-green'
    },
    {
      icon: Target,
      label: 'PEP Matches',
      value: stats.pep,
      change: 'Today',
      color: 'text-threat-critical'
    },
    {
      icon: Zap,
      label: 'Sanctions Hit',
      value: stats.sanctions,
      change: 'Active',
      color: 'text-warning-amber'
    }
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Risk Level Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-8 border ${riskLevel.bg === 'bg-acid-green/10' ? 'border-acid-green/30' : riskLevel.bg === 'bg-warning-amber/10' ? 'border-warning-amber/30' : 'border-threat-critical/30'}`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute -top-1/2 -right-1/2 w-96 h-96 rounded-full ${riskLevel.bg}`}></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-2">Overall Risk Level</p>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-black ${riskLevel.color}`}>{riskScore}</span>
              <span className={`text-lg font-bold ${riskLevel.color}`}>{riskLevel.level}</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-slate-400 mb-2">Monitoring Status</p>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-acid-green/10 border border-acid-green/30"
            >
              <div className="w-2 h-2 rounded-full bg-acid-green animate-pulse"></div>
              <span className="text-acid-green font-bold">ACTIVE</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800/70 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-xs font-bold text-slate-400">{stat.change}</span>
              </div>
              <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Compliance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-acid-green/10 border border-acid-green/30 rounded-xl"
      >
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="w-5 h-5 text-acid-green flex-shrink-0" />
          <span className="font-bold text-acid-green">Compliance Status</span>
        </div>
        <p className="text-sm text-slate-300">
          ✓ All transactions screened against regulatory databases
          <br/>✓ {stats.pep} Politically Exposed Persons detected
          <br/>✓ {stats.sanctions} Sanctions match found and flagged
          <br/>✓ Ready for regulatory reporting
        </p>
      </motion.div>

      {/* Performance Metrics */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-neon-cyan">Performance Metrics</h4>
        
        {[
          { label: 'System Uptime', value: 99.99, max: 100 },
          { label: 'Detection Accuracy', value: stats.accuracy, max: 100 },
          { label: 'Processing Speed', value: 98, max: 100 },
          { label: 'Compliance Score', value: 96.5, max: 100 }
        ].map((metric, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{metric.label}</span>
              <span className="font-bold text-neon-cyan">{metric.value}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="h-full bg-gradient-to-r from-neon-cyan to-acid-green rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
