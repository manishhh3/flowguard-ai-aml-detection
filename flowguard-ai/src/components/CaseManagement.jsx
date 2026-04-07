import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, User, DollarSign, ArrowRight, Filter, Search } from 'lucide-react';

export default function CaseManagement() {
  const [cases] = useState([
    {
      id: 'CASE001',
      title: 'PEP Transaction - ACC001',
      severity: 'critical',
      status: 'investigation',
      assigned: 'Sarah Chen',
      amount: '₹25,00,000',
      created: new Date(Date.now() - 2 * 24 * 60 * 60000),
      priority: 'P0',
      progress: 85
    },
    {
      id: 'CASE002',
      title: 'Structuring Pattern - ACC045',
      severity: 'high',
      status: 'review',
      assigned: 'John Malik',
      amount: '₹18,50,000',
      created: new Date(Date.now() - 5 * 24 * 60 * 60000),
      priority: 'P1',
      progress: 60
    },
    {
      id: 'CASE003',
      title: 'Sanctions Match - ACC089',
      severity: 'critical',
      status: 'escalated',
      assigned: 'Priya Sharma',
      amount: '₹45,00,000',
      created: new Date(Date.now() - 1 * 24 * 60 * 60000),
      priority: 'P0',
      progress: 95
    },
    {
      id: 'CASE004',
      title: 'High Volume Alert - ACC012',
      severity: 'medium',
      status: 'pending',
      assigned: 'Unassigned',
      amount: '₹12,75,000',
      created: new Date(Date.now() - 8 * 60 * 60000),
      priority: 'P2',
      progress: 20
    },
    {
      id: 'CASE005',
      title: 'Unusual Activity - ACC078',
      severity: 'low',
      status: 'closed',
      assigned: 'Mike Johnson',
      amount: '₹5,60,000',
      created: new Date(Date.now() - 7 * 24 * 60 * 60000),
      priority: 'P3',
      progress: 100
    }
  ]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-threat-critical/20 text-threat-critical border-threat-critical/50';
      case 'high': return 'bg-threat-high/20 text-threat-high border-threat-high/50';
      case 'medium': return 'bg-acid-green/20 text-acid-green border-acid-green/50';
      case 'low': return 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-700/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'investigation': return 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30';
      case 'review': return 'bg-acid-green/10 text-acid-green border-acid-green/30';
      case 'escalated': return 'bg-threat-critical/10 text-threat-critical border-threat-critical/30';
      case 'pending': return 'bg-slate-700/30 text-slate-300 border-slate-700/50';
      case 'closed': return 'bg-slate-800/30 text-slate-500 border-slate-700/50';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-700/50';
    }
  };

  const filteredCases = cases.filter(c => 
    (filterStatus === 'all' || c.status === filterStatus) &&
    (search === '' || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    open: cases.filter(c => c.status !== 'closed').length,
    highPriority: cases.filter(c => ['P0', 'P1'].includes(c.priority)).length,
    avgAge: Math.round(cases.reduce((sum, c) => sum + (Date.now() - c.created)) / cases.length / (24 * 60 * 60000))
  };

  const statCards = [
    {
      label: 'Open Cases',
      value: stats.open,
      icon: FileText,
      cardClass: 'p-3 rounded-lg border bg-slate-800/30 border-neon-cyan/30',
      valueClass: 'text-2xl font-bold text-neon-cyan mt-1',
      iconClass: 'w-5 h-5 text-neon-cyan/60'
    },
    {
      label: 'High Priority',
      value: stats.highPriority,
      icon: Clock,
      cardClass: 'p-3 rounded-lg border bg-slate-800/30 border-threat-critical/30',
      valueClass: 'text-2xl font-bold text-threat-critical mt-1',
      iconClass: 'w-5 h-5 text-threat-critical/60'
    },
    {
      label: 'Avg Age (days)',
      value: stats.avgAge,
      icon: DollarSign,
      cardClass: 'p-3 rounded-lg border bg-slate-800/30 border-acid-green/30',
      valueClass: 'text-2xl font-bold text-acid-green mt-1',
      iconClass: 'w-5 h-5 text-acid-green/60'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3"
      >
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={stat.cardClass}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className={stat.valueClass}>{stat.value}</p>
              </div>
              <stat.icon className={stat.iconClass} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-neon-cyan hover:border-neon-cyan/50 transition-all"
        >
          <Filter className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'investigation', 'review', 'escalated', 'closed'].map(status => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-neon-cyan/30'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Cases list */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredCases.map((caseItem, i) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:border-neon-cyan/30 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getSeverityColor(caseItem.severity)}`}>
                    {caseItem.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getStatusColor(caseItem.status)}`}>
                    {caseItem.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500 ml-auto">{caseItem.id}</span>
                </div>
                <h5 className="font-bold text-white text-sm mb-1">{caseItem.title}</h5>
              </div>
              <motion.div
                whileHover={{ x: 4 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowRight className="w-5 h-5 text-neon-cyan" />
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs text-acid-green font-bold">{caseItem.progress}%</span>
              </div>
              <div className="w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${caseItem.progress}%` }}
                  className="h-full bg-gradient-to-r from-neon-cyan to-acid-green"
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Amount</span>
                <p className="text-neon-cyan font-bold">{caseItem.amount}</p>
              </div>
              <div>
                <span className="text-slate-500">Assigned</span>
                <p className="text-slate-300 font-mono text-[10px] truncate">{caseItem.assigned}</p>
              </div>
              <div>
                <span className="text-slate-500">Priority</span>
                <p className={`font-bold ${caseItem.priority === 'P0' ? 'text-threat-critical' : caseItem.priority === 'P1' ? 'text-threat-high' : 'text-acid-green'}`}>
                  {caseItem.priority}
                </p>
              </div>
              <div>
                <span className="text-slate-500">Age</span>
                <p className="text-slate-300">{Math.floor((Date.now() - caseItem.created) / (24 * 60 * 60000))}d</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
