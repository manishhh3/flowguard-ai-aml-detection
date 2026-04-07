import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Play, Pause, Wifi, Settings, CheckCircle2, Upload, Download, BarChart3, AlertCircle, TrendingUp, FileText, Filter, Eye, EyeOff, Zap, Grid3x3, Activity, Brain } from 'lucide-react';
import DataFirehose from './components/DataFirehose';
import ThreatMatrix from './components/ThreatMatrix';
import ExecutionLog from './components/ExecutionLog';
import UploadPanel from './components/UploadPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ComplianceReporting from './components/ComplianceReporting';
import AdvancedMetrics from './components/AdvancedMetrics';
import NetworkGraph from './components/NetworkGraph';
import SystemHealth from './components/SystemHealth';
import MLModelsMonitor from './components/MLModelsMonitor';
import RulesEngine from './components/RulesEngine';
import RealTimeAlerts from './components/RealTimeAlerts';
import CaseManagement from './components/CaseManagement';
import RegressionAnalysis from './components/RegressionAnalysis';
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
  amount: Math.floor(Math.random() * 80000) + 5000,
  status: 'CLEARED',
  source: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
  destination: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
  currency: 'INR'
});

const generateSuspiciousTransaction = (index) => {
  const amounts = [185000, 190000, 195000, 188000, 192000];
  return {
    id: Date.now() + Math.random(),
    time: generateTime(),
    txnId: generateTxnId(),
    amount: amounts[index % amounts.length],
    status: 'ANALYZING',
    source: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
    destination: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
    currency: 'INR'
  };
};

// Agent log script
const agentScript = [
  { type: 'system', message: 'Agent AML-7 initialized and ready.' },
  { type: 'agent', message: 'Connecting to SWIFT gateway...' },
  { type: 'processing', message: 'Loading baseline patterns...' },
  { type: 'agent', message: 'System calibration: 12-factor risk model activated.' },
  { type: 'agent', message: 'Real-time transaction stream initialized.' },
  { type: 'processing', message: 'Monitoring for suspicious patterns...' },
  { type: 'agent', message: 'Isolation Forest model loaded.' },
  { type: 'agent', message: 'Statistical anomaly detection: ACTIVE' }
];

export default function App() {
  const [isLive, setIsLive] = useState(true);
  const [transactions, setTransactions] = useState(() => {
    // Initialize with demo data
    return Array.from({ length: 15 }, () => generateNormalTransaction());
  });
  
  const [logs, setLogs] = useState(() => agentScript.slice(0, 3));
  const [riskScore, setRiskScore] = useState(25);
  const [suspiciousCount, setSuspiciousCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [threatNodes, setThreatNodes] = useState(() => 
    Array.from({ length: 10 }, (_, i) => ({ id: i, suspicious: i % 3 === 0 }))
  );
  const [showSettings, setShowSettings] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [filterRisk, setFilterRisk] = useState('all');
  const [stats, setStats] = useState({
    totalProcessed: 1247,
    flagged: 24,
    cleared: 1223,
    accuracy: 94.8,
    avgProcessTime: '2.3ms',
    falsePositives: 2,
    detectionRate: 96.5,
    pep: 3,
    sanctions: 1,
    compliance: 'FULLY_COMPLIANT',
    riskDistribution: {
      critical: 4,
      high: 8,
      medium: 12,
      low: 1200
    }
  });

  const tickRef = useRef(0);
  const scriptIndexRef = useRef(agentScript.length - 1);
  const suspiciousCountRef = useRef(0);

  const addLog = useCallback((logEntry) => {
    const fullLog = {
      ...logEntry,
      id: Date.now() + Math.random(),
      timestamp: generateTime()
    };
    setLogs(prev => [...prev.slice(-20), fullLog]);
  }, []);

  const processTransaction = useCallback(() => {
    if (!isLive) return;

    tickRef.current += 1;
    const tick = tickRef.current;

    const shouldBeSuspicious = tick > 5 && (tick - 6) % (4 - Math.floor(simulationSpeed)) === 0 && suspiciousCountRef.current < 10;

    if (shouldBeSuspicious) {
      const txn = generateSuspiciousTransaction(suspiciousCountRef.current);
      setTransactions(prev => [txn, ...prev].slice(0, 50));
      setThreatNodes(prev => [...prev, { id: Date.now(), suspicious: true }].slice(-20));

      const newRisk = Math.min(95, riskScore + 12);
      setRiskScore(newRisk);

      setTimeout(() => {
        setTransactions(prev =>
          prev.map(t => t.id === txn.id ? { ...t, status: 'FLAGGED' } : t)
        );
        suspiciousCountRef.current += 1;
        setSuspiciousCount(suspiciousCountRef.current);
        setStats(prev => ({
          ...prev,
          flagged: prev.flagged + 1,
          totalProcessed: prev.totalProcessed + 1
        }));

        if (scriptIndexRef.current < agentScript.length - 1) {
          addLog(agentScript[scriptIndexRef.current + 1]);
          scriptIndexRef.current += 1;
        }

        if (suspiciousCountRef.current >= 4) {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 5000);
        }
      }, 1500);
    } else {
      const txn = generateNormalTransaction();
      setTransactions(prev => [txn, ...prev].slice(0, 50));
      setThreatNodes(prev => [...prev, { id: Date.now(), suspicious: false }].slice(-20));
      setStats(prev => ({
        ...prev,
        cleared: prev.cleared + 1,
        totalProcessed: prev.totalProcessed + 1
      }));

      if (suspiciousCountRef.current === 0 && riskScore > 10) {
        setRiskScore(prev => Math.max(10, prev - 1));
      }
    }
  }, [isLive, riskScore, simulationSpeed, addLog]);

  const handleTransactionsImport = useCallback((importedTransactions) => {
    setTransactions(prev => [
      ...importedTransactions.map(t => ({
        ...t,
        id: Date.now() + Math.random(),
        time: t.time || generateTime(),
        status: 'ANALYZING'
      })),
      ...prev
    ].slice(0, 100));

    setStats(prev => ({
      ...prev,
      totalProcessed: prev.totalProcessed + importedTransactions.length,
      cleared: prev.cleared + Math.floor(importedTransactions.length * 0.9)
    }));

    addLog({
      type: 'system',
      message: `Imported ${importedTransactions.length} transactions successfully`
    });
  }, [addLog]);

  // Main simulation loop
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      processTransaction();
    }, 1500 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isLive, processTransaction, simulationSpeed]);

  // Initialize logs
  useEffect(() => {
    if (logs.length < 3) {
      agentScript.slice(0, 3).forEach((log, i) => {
        setTimeout(() => addLog(log), i * 500);
      });
    }
  }, []);

  return (
    <div className="app-shell text-white overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-threat-critical/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="topbar">
        <div className="page-wrap flex items-center justify-between px-2 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 backdrop-blur-sm"
            >
              <Shield className="w-6 h-6 text-neon-cyan" />
            </motion.div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-gradient">FlowGuard AI</span>
              </h1>
              <p className="panel-title">
                Enterprise Anti-Money Laundering Detection System
              </p>
            </div>
          </motion.div>

          {/* Status Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            {/* Quick Stats */}
            <div className="hidden xl:flex items-center gap-4 px-4 py-2 rounded-lg glass text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Processed</span>
                <span className="font-bold text-neon-cyan">{stats.totalProcessed}</span>
              </div>
              <div className="w-px h-8 bg-slate-700/30" />
              <div className="flex flex-col gap-1">
                <span className="text-slate-500">Flagged</span>
                <span className="font-bold text-threat-critical">{stats.flagged}</span>
              </div>
            </div>

            {/* Gateway Status */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-lg glass">
              <motion.div
                animate={{ opacity: isLive ? [0.65, 1, 0.65] : 0.35 }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Wifi className={`w-5 h-5 ${isLive ? 'text-acid-green' : 'text-slate-500'}`} />
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-400">Gateway</p>
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
              className={`hidden sm:flex items-center gap-2.5 px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg glass">
              <span className={`status-dot ${!isLive ? 'bg-slate-600 shadow-none' : ''}`} />
              <span className={`text-xs font-bold tracking-wide ${isLive ? 'text-acid-green' : 'text-slate-500'}`}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </span>
            </div>

            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2.5 rounded-lg glass border border-slate-700/30 hover:border-neon-cyan/30 transition-colors"
            >
              <Settings className="w-5 h-5 text-neon-cyan" />
            </motion.button>
          </motion.div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-slate-700/30 bg-dark-secondary/30"
            >
              <div className="page-wrap flex items-center gap-8 px-2 py-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-400">Simulation Speed</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.5"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                    className="w-32 h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-bold text-neon-cyan w-12">{simulationSpeed}x</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Tab Navigation */}
      <div className="relative border-b border-slate-700/30 bg-dark-secondary/20">
        <div className="page-wrap px-2 py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'compliance', label: 'Compliance', icon: FileText },
            { id: 'alerts', label: 'Live Alerts', icon: Zap },
            { id: 'cases', label: 'Case Mgmt', icon: Grid3x3 },
            { id: 'rules', label: 'Rules', icon: Activity },
            { id: 'advanced', label: 'Advanced', icon: Brain },
            { id: 'upload', label: 'Upload Data', icon: Upload }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-pill whitespace-nowrap ${activeTab === tab.id ? 'tab-pill-active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-bold text-sm">{tab.label}</span>
              </motion.button>
            );
          })}
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="page-wrap relative px-2 pt-6 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8"
            >
              {/* Left Panel - Data Firehose (30%) */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="xl:col-span-1 card-elevated panel-shell firehose-compact"
              >
                <div className="panel-head">
                  <span className="panel-label">Live Transactions</span>
                </div>
                <div className="panel-content">
                  <DataFirehose transactions={transactions} />
                </div>
              </motion.div>

              {/* Center Panel - Threat Matrix (40%) */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="xl:col-span-7 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">Threat Intelligence</span>
                  <span className="metric-chip">Suspicious {suspiciousCount}</span>
                </div>
                <div className="panel-content">
                  <ThreatMatrix
                    riskScore={riskScore}
                    suspiciousCount={suspiciousCount}
                    showAlert={showAlert}
                    threatNodes={threatNodes}
                  />
                </div>
              </motion.div>

              {/* Right Panel - Execution Log (30%) */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="xl:col-span-4 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">Execution Timeline</span>
                </div>
                <div className="panel-content">
                  <ExecutionLog logs={logs} isPaused={!isLive} />
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <AnalyticsDashboard stats={stats} riskScore={riskScore} transactions={transactions} />
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ComplianceReporting stats={stats} transactions={transactions} suspiciousCount={suspiciousCount} />
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <UploadPanel onTransactionsImport={handleTransactionsImport} />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <RealTimeAlerts />
            </motion.div>
          )}

          {activeTab === 'cases' && (
            <motion.div
              key="cases"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <CaseManagement />
            </motion.div>
          )}

          {activeTab === 'rules' && (
            <motion.div
              key="rules"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="xl:col-span-6 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">Detection Rules</span>
                </div>
                <div className="panel-content">
                  <RulesEngine />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="xl:col-span-6 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">Model Regression Insights</span>
                </div>
                <div className="panel-content">
                  <RegressionAnalysis />
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'advanced' && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 xl:grid-cols-12 gap-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="xl:col-span-3 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">System Metrics</span>
                </div>
                <div className="panel-content">
                  <AdvancedMetrics />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="xl:col-span-4 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">Entity Network</span>
                </div>
                <div className="panel-content">
                  <NetworkGraph />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="xl:col-span-2 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">Service Health</span>
                </div>
                <div className="panel-content">
                  <SystemHealth />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="xl:col-span-3 card-elevated panel-shell"
              >
                <div className="panel-head">
                  <span className="panel-label">ML Models</span>
                </div>
                <div className="panel-content">
                  <MLModelsMonitor />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Status Bar */}
      <footer className="relative backdrop-blur-md bg-dark-secondary/65 border-t border-slate-700/30 mt-8">
        <div className="page-wrap hidden md:flex items-center justify-between px-2 py-3 text-xs">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-slate-400"
          >
            <div className="w-2 h-2 rounded-full bg-neon-cyan" />
            <span>Region: Mumbai (ap-south-1) | Latency: 12ms | Database: Live</span>
          </motion.div>
          
          <div className="flex items-center gap-6 text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-acid-green" />
              Accuracy: {stats.accuracy}%
            </span>
            <span>v2.7.1 | © 2026 Union Bank of India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
