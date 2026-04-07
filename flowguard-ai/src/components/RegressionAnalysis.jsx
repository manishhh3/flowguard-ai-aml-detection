import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3, Download, RefreshCw } from 'lucide-react';

export default function RegressionAnalysis() {
  const [timeRange, setTimeRange] = useState('7d');

  const regressionData = {
    '7d': {
      correlation: 0.87,
      rSquared: 0.76,
      forecast: '+12%',
      trend: 'up',
      factors: [
        { name: 'Transaction Volume', coefficient: 0.45, impact: 'high' },
        { name: 'Time of Day', coefficient: 0.32, impact: 'medium' },
        { name: 'Account Age', coefficient: 0.18, impact: 'low' },
        { name: 'Customer Risk Score', coefficient: 0.61, impact: 'high' }
      ]
    },
    '30d': {
      correlation: 0.82,
      rSquared: 0.71,
      forecast: '+8%',
      trend: 'up',
      factors: [
        { name: 'Transaction Volume', coefficient: 0.42, impact: 'high' },
        { name: 'Time of Day', coefficient: 0.28, impact: 'medium' },
        { name: 'Account Age', coefficient: 0.21, impact: 'low' },
        { name: 'Customer Risk Score', coefficient: 0.58, impact: 'high' }
      ]
    },
    '90d': {
      correlation: 0.79,
      rSquared: 0.68,
      forecast: '+5%',
      trend: 'stable',
      factors: [
        { name: 'Transaction Volume', coefficient: 0.38, impact: 'medium' },
        { name: 'Time of Day', coefficient: 0.25, impact: 'medium' },
        { name: 'Account Age', coefficient: 0.24, impact: 'medium' },
        { name: 'Customer Risk Score', coefficient: 0.55, impact: 'high' }
      ]
    }
  };

  const current = regressionData[timeRange];

  const metrics = [
    {
      label: 'Correlation',
      value: (current.correlation * 100).toFixed(1),
      unit: '%',
      icon: Activity,
      textClass: 'text-neon-cyan',
      iconClass: 'w-4 h-4 text-neon-cyan'
    },
    {
      label: 'R-Squared',
      value: (current.rSquared * 100).toFixed(1),
      unit: '%',
      icon: BarChart3,
      textClass: 'text-acid-green',
      iconClass: 'w-4 h-4 text-acid-green'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h4 className="text-sm font-bold text-neon-cyan">Regression Analysis</h4>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-neon-cyan transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-acid-green transition-all"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Time range selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d'].map(range => (
          <motion.button
            key={range}
            whileHover={{ scale: 1.05 }}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === range
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-neon-cyan/30'
            }`}
          >
            {range}
          </motion.button>
        ))}
      </div>

      {/* Main metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={timeRange}
        className="grid grid-cols-2 gap-3"
      >
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-slate-400">{metric.label}</span>
              <metric.icon className={metric.iconClass} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${metric.textClass}`}>
                {metric.value}
              </span>
              <span className={`text-xs ${metric.textClass}`}>{metric.unit}</span>
            </div>
            <div className={`text-xs mt-2 flex items-center gap-1 ${current.trend === 'up' ? 'text-acid-green' : 'text-slate-500'}`}>
              {current.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              Forecast: {current.forecast}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Coefficient factors */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold text-slate-400">REGRESSION FACTORS</h5>
        <div className="space-y-2">
          {current.factors.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-2 bg-slate-800/30 border border-slate-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h6 className="text-sm font-bold text-slate-200">{factor.name}</h6>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                  factor.impact === 'high' ? 'border-threat-critical/50 bg-threat-critical/10 text-threat-critical' :
                  factor.impact === 'medium' ? 'border-acid-green/50 bg-acid-green/10 text-acid-green' :
                  'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan'
                }`}>
                  {factor.impact.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-3">
                  <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.coefficient * 100}%` }}
                      className="h-full bg-gradient-to-r from-neon-cyan to-acid-green"
                    />
                  </div>
                </div>
                <span className="text-xs font-mono text-neon-cyan font-bold">
                  {factor.coefficient.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Statistical summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-3 bg-gradient-to-r from-neon-cyan/10 to-acid-green/10 border border-neon-cyan/30 rounded-lg"
      >
        <p className="text-xs text-slate-300">
          <span className="text-neon-cyan font-bold">Model Quality:</span> The regression model explains {(current.rSquared * 100).toFixed(1)}% of the variance in detection accuracy with strong factor correlation ({(current.correlation * 100).toFixed(1)}%).
        </p>
      </motion.div>
    </div>
  );
}
