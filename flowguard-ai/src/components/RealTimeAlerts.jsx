import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Zap, TrendingUp, X, Volume2, VolumeX } from 'lucide-react';

export default function RealTimeAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'PEP Transaction Detected',
      message: 'Account ID ACC001 transferred to known PEP - Immediate action required',
      timestamp: new Date(Date.now() - 2 * 60000),
      status: 'active',
      riskScore: 98
    },
    {
      id: 2,
      type: 'warning',
      title: 'Structuring Pattern Detected',
      message: 'Multiple transactions just below 2L threshold in 3 hours',
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'active',
      riskScore: 85
    },
    {
      id: 3,
      type: 'info',
      title: 'High Volume Detected',
      message: 'Account ACC045 exceeds average daily volume by 4.8x',
      timestamp: new Date(Date.now() - 12 * 60000),
      status: 'active',
      riskScore: 72
    },
    {
      id: 4,
      type: 'critical',
      title: 'Sanctions List Match',
      message: 'Beneficiary matched against OFAC consolidated list',
      timestamp: new Date(Date.now() - 18 * 60000),
      status: 'acknowledged',
      riskScore: 99
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState('all');

  // Simulate new alerts
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        const types = ['warning', 'info'];
        const newAlert = {
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)],
          title: 'New Alert Generated',
          message: 'Transaction matched alert rule',
          timestamp: new Date(),
          status: 'active',
          riskScore: Math.floor(Math.random() * 40) + 60
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.status === filter);

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-threat-critical/50 bg-threat-critical/5';
      case 'warning': return 'border-threat-high/50 bg-threat-high/5';
      case 'info': return 'border-neon-cyan/50 bg-neon-cyan/5';
      default: return 'border-slate-700/50 bg-slate-800/50';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-threat-critical" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-threat-high" />;
      case 'info': return <Zap className="w-4 h-4 text-neon-cyan" />;
      default: return null;
    }
  };

  const getRiskColor = (score) => {
    if (score >= 90) return 'text-threat-critical';
    if (score >= 75) return 'text-threat-high';
    return 'text-acid-green';
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-neon-cyan">Live Alert Stream</h4>
          <span className="px-2 py-1 text-xs bg-threat-critical/20 text-threat-critical rounded-full font-bold">
            {alerts.filter(a => a.status === 'active').length} Active
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg transition-all ${soundEnabled ? 'bg-acid-green/20 text-acid-green' : 'bg-slate-700/50 text-slate-500'}`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </motion.button>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'acknowledged'].map(tab => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filter === tab
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-neon-cyan/30'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className={`p-3 border rounded-lg transition-all group ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon and content */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="pt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold text-white text-sm">{alert.title}</h5>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${getRiskColor(alert.riskScore)} bg-slate-950/50`}>
                        <TrendingUp className="w-3 h-3" />
                        {alert.riskScore}%
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{alert.message}</p>
                    <span className="text-xs text-slate-500">
                      {Math.floor((Date.now() - alert.timestamp) / 60000)}m ago
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {alert.status === 'active' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-2 py-1.5 rounded text-xs bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 font-bold whitespace-nowrap"
                    >
                      Acknowledge
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1.5 rounded bg-slate-700/50 text-slate-400 hover:bg-slate-600/50"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 p-2 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-threat-critical">{alerts.filter(a => a.type === 'critical').length}</div>
          <div className="text-xs text-slate-400">Critical</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-threat-high">{alerts.filter(a => a.type === 'warning').length}</div>
          <div className="text-xs text-slate-400">Warnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neon-cyan">{alerts.filter(a => a.type === 'info').length}</div>
          <div className="text-xs text-slate-400">Info</div>
        </div>
      </div>
    </div>
  );
}
