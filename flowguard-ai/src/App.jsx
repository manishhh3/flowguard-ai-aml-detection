import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Play, Pause, Radio, Wifi } from 'lucide-react';
import DataFirehose from './components/DataFirehose';
import ThreatMatrix from './components/ThreatMatrix';
import ExecutionLog from './components/ExecutionLog';
import './index.css';

// Transaction generator utilities
const generateTxnId = () => {
  return `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

const generateTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false });
};

const generateNormalTransaction = () => ({
  id: Date.now() + Math.random(),
  time: generateTime(),
  txnId: generateTxnId(),
  amount: Math.floor(Math.random() * 80000) + 5000, // 5K - 85K
  status: 'CLEARED'
});

const generateSuspiciousTransaction = (index) => {
  // Amounts just below 2L threshold (1.85L - 1.99L for structuring pattern)
  const amounts = [185000, 190000, 195000, 188000, 192000];
  return {
    id: Date.now() + Math.random(),
    time: generateTime(),
    txnId: generateTxnId(),
    amount: amounts[index % amounts.length],
    status: 'ANALYZING'
  };
};

// Agent log script
const agentScript = [
  { type: 'system', message: 'Agent AML-7 online.' },
  { type: 'agent', message: 'Monitoring SWIFT gateway...' },
  { type: 'agent', message: 'Baseline pattern analysis initialized.' },
  { type: 'processing', message: 'Anomaly detected on Acct #4492.' },
  { type: 'agent', message: 'Cross-referencing historical ledgers...' },
  { type: 'alert', message: 'Structuring pattern identified. 5 transactions just below INR 2L threshold.' },
  { type: 'action', message: 'Executing freeze protocol. Generating SAR.' }
];

export default function App() {
  const [isLive, setIsLive] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [riskScore, setRiskScore] = useState(15);
  const [suspiciousCount, setSuspiciousCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [threatNodes, setThreatNodes] = useState([]);

  const tickRef = useRef(0);
  const scriptIndexRef = useRef(0);
  const suspiciousCountRef = useRef(0);

  const addLog = useCallback((logEntry) => {
    const fullLog = {
      ...logEntry,
      id: Date.now() + Math.random(),
      timestamp: generateTime()
    };
    setLogs(prev => [...prev, fullLog]);
  }, []);

  const processTransaction = useCallback(() => {
    tickRef.current += 1;
    const tick = tickRef.current;

    // Decide if this should be a suspicious transaction
    // Start suspicious transactions after tick 5, one every 3 ticks
    const shouldBeSuspicious = tick > 5 && (tick - 6) % 3 === 0 && suspiciousCountRef.current < 5;

    if (shouldBeSuspicious) {
      // Generate suspicious transaction
      const txn = generateSuspiciousTransaction(suspiciousCountRef.current);
      setTransactions(prev => [txn, ...prev].slice(0, 50));

      // Update threat nodes
      setThreatNodes(prev => [...prev, { id: Date.now(), suspicious: true }]);

      // Increase risk score
      const newRisk = Math.min(95, riskScore + 15);
      setRiskScore(newRisk);

      // After a delay, update to FLAGGED
      setTimeout(() => {
        setTransactions(prev =>
          prev.map(t => t.id === txn.id ? { ...t, status: 'FLAGGED' } : t)
        );
        suspiciousCountRef.current += 1;
        setSuspiciousCount(suspiciousCountRef.current);

        // Trigger agent script based on suspicious count
        const scriptMessages = {
          1: 3, // "Anomaly detected..." at 1st suspicious
          2: 4, // "Cross-referencing..." at 2nd suspicious
          3: 4, // Same
          4: 5, // "Structuring pattern..." at 4th suspicious
          5: 6  // "Executing freeze..." at 5th suspicious
        };

        if (scriptMessages[suspiciousCountRef.current] !== undefined) {
          const idx = scriptMessages[suspiciousCountRef.current];
          if (idx < agentScript.length && scriptIndexRef.current <= idx) {
            for (let i = scriptIndexRef.current; i <= idx; i++) {
              setTimeout(() => addLog(agentScript[i]), (i - scriptIndexRef.current) * 800);
            }
            scriptIndexRef.current = idx + 1;
          }
        }

        // Show alert when 4th suspicious transaction is flagged
        if (suspiciousCountRef.current >= 4 && !showAlert) {
          setShowAlert(true);
        }
      }, 1500);

    } else {
      // Normal transaction
      const txn = generateNormalTransaction();
      setTransactions(prev => [txn, ...prev].slice(0, 50));

      // Add normal node
      setThreatNodes(prev => [...prev, { id: Date.now(), suspicious: false }].slice(-10));

      // Slowly decrease risk if no suspicious activity
      if (suspiciousCountRef.current === 0 && riskScore > 10) {
        setRiskScore(prev => Math.max(10, prev - 2));
      }
    }
  }, [riskScore, showAlert, addLog]);

  // Main simulation loop
  useEffect(() => {
    if (!isLive) return;

    // Initialize with first log
    if (logs.length === 0) {
      addLog(agentScript[0]);
      addLog(agentScript[1]);
      addLog(agentScript[2]);
      scriptIndexRef.current = 3;
    }

    const interval = setInterval(() => {
      processTransaction();
    }, 1500);

    return () => clearInterval(interval);
  }, [isLive, processTransaction, addLog, logs.length]);

  return (
    <div className="min-h-screen bg-dark-primary text-white overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-threat-critical/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-md bg-dark-secondary/50 border-b border-slate-700/30 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 245, 255, 0.3)',
                  '0 0 40px rgba(0, 245, 255, 0.5)',
                  '0 0 20px rgba(0, 245, 255, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 backdrop-blur-sm"
            >
              <Shield className="w-6 h-6 text-neon-cyan" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-gradient">FlowGuard AI</span>
              </h1>
              <p className="text-xs uppercase letter-spacing-widest text-slate-500 mt-1">
                Enterprise Anti-Money Laundering Detection System
              </p>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            {/* Gateway Status */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg glass">
              <motion.div 
                animate={{ scale: isLive ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Wifi className={`w-5 h-5 ${isLive ? 'text-acid-green' : 'text-slate-500'}`} />
              </motion.div>
              <div>
                <p className="text-xs uppercase letter-spacing-widest text-slate-400">Gateway</p>
                <p className={`text-sm font-bold ${isLive ? 'text-acid-green' : 'text-slate-500'}`}>
                  {isLive ? 'ACTIVE' : 'STANDBY'}
                </p>
              </div>
            </div>

            {/* Live/Pause Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all
                backdrop-blur-sm border
                ${isLive
                  ? 'bg-threat-critical/20 border-threat-critical/50 text-threat-critical hover:bg-threat-critical/30 hover:shadow-glow-pink'
                  : 'bg-acid-green/20 border-acid-green/50 text-acid-green hover:bg-acid-green/30 hover:shadow-glow-green'
                }`}
            >
              {isLive ? (
                <>
                  <Pause className="w-4 h-4" />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  RESUME
                </>
              )}
            </motion.button>

            {/* Status Badge */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass">
              <motion.div
                animate={{ scale: isLive ? [1, 1.1, 1] : 0 }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-acid-green shadow-glow-green' : 'bg-slate-600'}`}
              />
              <span className={`text-sm font-bold tracking-wide ${isLive ? 'text-acid-green' : 'text-slate-500'}`}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="relative px-6 py-6 grid grid-cols-12 gap-6 h-[calc(100vh-120px)] overflow-hidden">
        {/* Left Panel - Data Firehose (30%) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-3 card-elevated"
        >
          <DataFirehose transactions={transactions} />
        </motion.div>

        {/* Center Panel - Threat Matrix (40%) */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-6 card-elevated"
        >
          <ThreatMatrix
            riskScore={riskScore}
            suspiciousCount={suspiciousCount}
            showAlert={showAlert}
            threatNodes={threatNodes}
          />
        </motion.div>

        {/* Right Panel - Execution Log (30%) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-3 card-elevated"
        >
          <ExecutionLog logs={logs} isPaused={!isLive} />
        </motion.div>
      </div>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-dark-secondary/50 border-t border-slate-700/30">
        <div className="flex items-center justify-between px-6 py-3 text-xs">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-slate-400"
          >
            <div className="w-2 h-2 rounded-full bg-neon-cyan" />
            <span>Region: Mumbai (ap-south-1) | Latency: 12ms</span>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-slate-400">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-acid-green animate-pulse' : 'bg-slate-500'}`} />
              {isLive ? 'Active Monitoring' : 'Inspection Mode'}
            </span>
            <span className="text-slate-500">Last SAR: {showAlert ? 'Generating...' : 'None pending'}</span>
            <span className="text-slate-500">v2.7.0 | © 2026 Union Bank of India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
