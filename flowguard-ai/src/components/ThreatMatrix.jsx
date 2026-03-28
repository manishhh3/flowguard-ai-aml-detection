import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertOctagon, Target, Zap, TrendingUp } from 'lucide-react';

export default function ThreatMatrix({ riskScore, suspiciousCount, showAlert, threatNodes }) {
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  const getRiskColor = (score) => {
    if (score < 30) return { stroke: '#39ff14', glow: 'rgba(57, 255, 20, 0.5)' };
    if (score < 60) return { stroke: '#ffb800', glow: 'rgba(255, 184, 0, 0.5)' };
    return { stroke: '#ff2d55', glow: 'rgba(255, 45, 85, 0.6)' };
  };

  const riskColor = getRiskColor(riskScore);

  return (
    <div className="h-full flex flex-col bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden relative">
      {/* Critical Alert Overlay */}
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center p-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 20px rgba(255, 45, 85, 0.3)',
                    '0 0 60px rgba(255, 45, 85, 0.6)',
                    '0 0 20px rgba(255, 45, 85, 0.3)'
                  ]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block p-6 rounded-2xl bg-crimson-alert/10 border-2 border-crimson-alert mb-6"
              >
                <AlertOctagon className="w-20 h-20 text-crimson-alert" />
              </motion.div>

              <motion.h2
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="text-3xl font-black text-crimson-alert mb-4 tracking-wider"
                style={{ textShadow: '0 0 30px rgba(255, 45, 85, 0.8)' }}
              >
                SYSTEM OVERRIDE
              </motion.h2>

              <motion.div
                animate={{
                  backgroundColor: ['rgba(255, 45, 85, 0.1)', 'rgba(255, 45, 85, 0.2)', 'rgba(255, 45, 85, 0.1)']
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="px-6 py-4 rounded-lg border border-crimson-alert/50 mb-6"
              >
                <p className="text-2xl font-bold text-white">
                  LAYERING ATTACK DETECTED
                </p>
              </motion.div>

              <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-crimson-alert animate-pulse" />
                  Auto-freeze initiated
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning-amber animate-pulse" />
                  SAR generating...
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
        <Target className="w-4 h-4 text-neon-cyan" />
        <span className="text-neon-cyan font-semibold text-sm tracking-wider">
          LIVE THREAT MATRIX
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Shield className={`w-4 h-4 ${riskScore >= 60 ? 'text-crimson-alert' : 'text-acid-green'}`} />
          <span className={`text-xs font-bold ${riskScore >= 60 ? 'text-crimson-alert' : 'text-acid-green'}`}>
            {riskScore >= 60 ? 'ELEVATED' : 'NOMINAL'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        {/* Risk Scoreometer */}
        <div className="relative mb-8">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#1e293b"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <motion.circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke={riskColor.stroke}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                filter: `drop-shadow(0 0 10px ${riskColor.glow})`
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={riskScore}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-black"
              style={{ color: riskColor.stroke, textShadow: `0 0 20px ${riskColor.glow}` }}
            >
              {riskScore}
            </motion.span>
            <span className="text-xs text-slate-400 mt-1">RISK INDEX</span>
          </div>
        </div>

        {/* Threat Indicators */}
        <div className="w-full grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
            <Zap className="w-5 h-5 text-warning-amber mx-auto mb-1" />
            <span className="text-2xl font-bold text-white">{suspiciousCount}</span>
            <p className="text-[10px] text-slate-400 mt-1">SUSPICIOUS TXN</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
            <TrendingUp className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
            <span className="text-2xl font-bold text-white">{threatNodes.length}</span>
            <p className="text-[10px] text-slate-400 mt-1">ACTIVE NODES</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 text-center">
            <Shield className="w-5 h-5 text-acid-green mx-auto mb-1" />
            <span className="text-2xl font-bold text-white">
              {Math.max(0, 5 - suspiciousCount)}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">THRESHOLD GAP</p>
          </div>
        </div>

        {/* Dynamic Node Map */}
        <div className="w-full bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
          <div className="text-xs text-slate-500 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            REAL-TIME PATTERN ANALYSIS
          </div>
          <div className="relative h-24 overflow-hidden">
            <AnimatePresence mode="popLayout">
              {threatNodes.slice(-6).map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="absolute"
                  style={{
                    left: `${(i * 16) + 2}%`,
                    top: `${30 + Math.sin(i) * 20}%`
                  }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      boxShadow: node.suspicious
                        ? ['0 0 10px rgba(255, 45, 85, 0.3)', '0 0 20px rgba(255, 45, 85, 0.6)', '0 0 10px rgba(255, 45, 85, 0.3)']
                        : ['0 0 5px rgba(0, 245, 255, 0.2)', '0 0 10px rgba(0, 245, 255, 0.4)', '0 0 5px rgba(0, 245, 255, 0.2)']
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className={`w-4 h-4 rounded-full ${
                      node.suspicious ? 'bg-crimson-alert' : 'bg-neon-cyan/60'
                    }`}
                  />
                  {i < threatNodes.slice(-6).length - 1 && (
                    <div
                      className={`absolute top-1/2 left-4 h-px w-8 ${
                        node.suspicious ? 'bg-crimson-alert/50' : 'bg-slate-600'
                      }`}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
