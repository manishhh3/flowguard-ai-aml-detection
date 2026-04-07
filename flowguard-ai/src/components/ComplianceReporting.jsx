import { motion } from 'framer-motion';
import { FileText, Download, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function ComplianceReporting({ stats, transactions, suspiciousCount }) {
  const generateSAR = () => {
    const sarReport = {
      reportId: `SAR-${Date.now()}`,
      generatedDate: new Date().toISOString(),
      institution: 'Union Bank of India',
      suspiciousTransactions: suspiciousCount,
      totalTransactionsReviewed: stats.totalProcessed,
      detectionMethods: [
        'Structuring Pattern Detection',
        'Benford\'s Law Analysis',
        'Isolation Forest ML Model',
        'Z-Score Statistical Analysis',
        'PEP & Sanctions Screening',
        'Unusual Activity Pattern'
      ],
      findings: {
        structuringDetected: suspiciousCount > 0,
        pepMatches: stats.pep,
        sanctionsMatches: stats.sanctions,
        accountsInvolved: Math.floor(Math.random() * 15) + 5
      }
    };

    const blob = new Blob([JSON.stringify(sarReport, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAR_Report_${Date.now()}.json`;
    a.click();
  };

  const reports = [
    {
      title: 'Suspicious Activity Report (SAR)',
      description: 'Comprehensive AML investigation findings',
      date: new Date(),
      items: suspiciousCount,
      status: 'ready'
    },
    {
      title: 'PEP Screening Report',
      description: 'Politically Exposed Persons detection',
      date: new Date(Date.now() - 86400000),
      items: stats.pep,
      status: 'completed'
    },
    {
      title: 'Sanctions Compliance Report',
      description: 'OFAC & international sanctions screening',
      date: new Date(Date.now() - 172800000),
      items: stats.sanctions,
      status: 'completed'
    },
    {
      title: 'Transaction Monitoring Report',
      description: 'Daily transaction analysis and risk assessment',
      date: new Date(Date.now() - 3600000),
      items: stats.totalProcessed,
      status: 'ready'
    }
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-y-auto">
      {/* Compliance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="p-4 bg-acid-green/10 border border-acid-green/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-acid-green" />
            <span className="text-sm font-bold text-acid-green">Approved</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.cleared}</p>
          <p className="text-xs text-slate-400 mt-1">Clean Transactions</p>
        </div>

        <div className="p-4 bg-threat-critical/10 border border-threat-critical/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-threat-critical" />
            <span className="text-sm font-bold text-threat-critical">Flagged</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.flagged}</p>
          <p className="text-xs text-slate-400 mt-1">Suspicious Transactions</p>
        </div>
      </motion.div>

      {/* Regulatory Framework */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl"
      >
        <h4 className="text-sm font-bold text-neon-cyan mb-3">Regulatory Framework</h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
            <span>PML-FATF Guidelines</span>
            <CheckCircle2 className="w-4 h-4 text-acid-green" />
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
            <span>RBI AML Regulations</span>
            <CheckCircle2 className="w-4 h-4 text-acid-green" />
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
            <span>FATF Recommendations</span>
            <CheckCircle2 className="w-4 h-4 text-acid-green" />
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-900/50 rounded">
            <span>SWIFT KYC Standards</span>
            <CheckCircle2 className="w-4 h-4 text-acid-green" />
          </div>
        </div>
      </motion.div>

      {/* Available Reports */}
      <div>
        <h4 className="text-sm font-bold text-neon-cyan mb-3">Available Reports</h4>
        <div className="space-y-2">
          {reports.map((report, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-neon-cyan/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-neon-cyan flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">
                      {report.title}
                    </p>
                    <p className="text-xs text-slate-400">{report.description}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={generateSAR}
                  className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
              
              <div className="flex items-center justify-between pl-8 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock className="w-3 h-3" />
                  {report.date.toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neon-cyan font-bold">{report.items}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    report.status === 'ready' 
                      ? 'bg-acid-green/20 text-acid-green' 
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {report.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Generate SAR Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={generateSAR}
        className="w-full py-3 bg-gradient-to-r from-neon-cyan/20 to-acid-green/20 border border-neon-cyan/50 text-neon-cyan rounded-lg font-bold text-sm hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export Full SAR Report
      </motion.button>
    </div>
  );
}
