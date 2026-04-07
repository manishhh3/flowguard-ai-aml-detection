import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle, Loader, TrendingUp } from 'lucide-react';

const statusConfig = {
  CLEARED: {
    color: 'text-acid-green',
    bg: 'bg-acid-green/5',
    border: 'border-acid-green/20',
    icon: CheckCircle,
    glow: 'shadow-[0_0_10px_rgba(57,255,20,0.2)]',
    badge: 'badge-success'
  },
  ANALYZING: {
    color: 'text-warning-amber',
    bg: 'bg-warning-amber/5',
    border: 'border-warning-amber/20',
    icon: Loader,
    glow: 'shadow-[0_0_10px_rgba(255,184,0,0.2)]',
    badge: 'badge-neon',
    animate: true
  },
  FLAGGED: {
    color: 'text-threat-critical',
    bg: 'bg-threat-critical/5',
    border: 'border-threat-critical/20',
    icon: AlertTriangle,
    glow: 'shadow-[0_0_15px_rgba(255,45,85,0.3)]',
    badge: 'badge-alert',
    animate: true
  }
};

export default function DataFirehose({ transactions }) {
  const visibleTransactions = transactions.slice(0, 6);

  const riskIndicator = transactions.some(t => t.status === 'FLAGGED') ? 'HIGH' : 
                       transactions.some(t => t.status === 'ANALYZING') ? 'MEDIUM' : 'LOW';

  return (
    <div className="h-full flex flex-col bg-slate-900/25 rounded-xl border border-slate-700/35 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/25 bg-slate-800/15">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="w-4 h-4 text-neon-cyan" />
          </motion.div>
          <div>
            <h3 className="text-neon-cyan font-bold text-xs tracking-wide uppercase">
              Data Firehose
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time Transaction Stream</p>
          </div>
        </div>

        <motion.div 
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/40 border border-slate-700/35"
        >
          <div className={`w-2 h-2 rounded-full ${
            riskIndicator === 'HIGH' ? 'bg-threat-critical' :
            riskIndicator === 'MEDIUM' ? 'bg-warning-amber' : 'bg-acid-green'
          }`} />
          <span className="text-xs font-semibold">{riskIndicator} RISK</span>
        </motion.div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-4 gap-3 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500 border-b border-slate-700/20 bg-slate-800/10">
        <span>Time</span>
        <span>TXN ID</span>
        <span className="text-right">Amount</span>
        <span className="text-center">Status</span>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {/* Gradient scan effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-15">
          <div className="w-full h-12 bg-gradient-to-b from-neon-cyan/10 via-transparent to-transparent animate-scan-line" />
        </div>

        <AnimatePresence mode="popLayout">
          {visibleTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full"
            >
              <p className="text-slate-500 text-sm">Waiting for transactions...</p>
            </motion.div>
          ) : (
            visibleTransactions.map((txn, index) => {
              const config = statusConfig[txn.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, y: -30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  className={`grid grid-cols-4 gap-3 px-4 py-2.5 text-sm border-b border-slate-800/35
                    transition-all duration-300
                    ${config.bg} ${config.border}
                    ${txn.status === 'FLAGGED' ? 'animate-threat-flash' : ''}
                    hover:bg-slate-800/20 hover:border-slate-700/40`}
                >
                  {/* Time */}
                  <span className="text-slate-400 font-mono text-xs">{txn.time}</span>

                  {/* TXN ID */}
                  <span className="text-slate-300 font-mono text-xs truncate hover:text-clip">
                    {txn.txnId}
                  </span>

                  {/* Amount */}
                  <motion.span
                    initial={{ color: '#cbd5e1' }}
                    animate={{ 
                      color: txn.amount >= 190000 ? '#ff2d55' : '#cbd5e1'
                    }}
                    className={`text-right font-mono text-xs font-semibold`}
                  >
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </motion.span>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`${config.badge} inline-flex items-center justify-center gap-1 px-2 py-0.5`}
                    >
                      <StatusIcon className={`w-3 h-3 ${config.animate ? 'animate-spin' : ''}`} />
                      <span className="text-xs font-bold">{txn.status}</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-700/25 bg-slate-800/10 flex items-center justify-between text-[10px] text-slate-500">
        <div className="flex gap-3">
          <span>Showing: {visibleTransactions.length} txns</span>
          <span>|</span>
          <span>Suspicious: {visibleTransactions.filter(t => t.status === 'FLAGGED').length}</span>
        </div>
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Live stream active
        </motion.span>
      </div>
    </div>
  );
}
