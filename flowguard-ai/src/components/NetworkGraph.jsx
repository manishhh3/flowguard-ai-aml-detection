import { motion } from 'framer-motion';
import { Network, Lock, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function NetworkGraph({ transactions }) {
  const nodes = transactions
    .filter(t => t.status === 'FLAGGED')
    .slice(0, 8)
    .map((t, i) => ({
      id: i,
      label: t.txnId?.slice(-6) || `NODE-${i}`,
      risk: Math.random() > 0.5 ? 'high' : 'medium',
      connections: Math.floor(Math.random() * 5) + 2
    }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h4 className="text-sm font-bold text-neon-cyan mb-4 flex items-center gap-2">
          <Network className="w-4 h-4" />
          Transaction Network Analysis
        </h4>
        <p className="text-xs text-slate-400 mb-4">Suspicious transaction relationships</p>
      </div>

      {/* Network Visualization */}
      <div className="relative h-64 bg-slate-900/50 border border-slate-700/50 rounded-lg overflow-hidden p-4">
        <svg className="w-full h-full" viewBox="0 0 400 300">
          {/* Connections */}
          {nodes.map((node, i) => {
            const otherNode = nodes[(i + 1) % nodes.length];
            const x1 = 50 + Math.random() * 300;
            const y1 = 50 + Math.random() * 200;
            const x2 = 50 + Math.random() * 300;
            const y2 = 50 + Math.random() * 200;
            return (
              <line
                key={`line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={node.risk === 'high' ? '#ff2d55' : '#ffb800'}
                strokeWidth="1"
                opacity="0.3"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const x = 70 + Math.random() * 260;
            const y = 70 + Math.random() * 160;
            return (
              <motion.g
                key={`node-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={node.risk === 'high' ? '#ff2d55' : '#ffb800'}
                  opacity="0.3"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="none"
                  stroke={node.risk === 'high' ? '#ff2d55' : '#ffb800'}
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy=".3em"
                  className="text-[8px] font-bold fill-white"
                >
                  {node.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Node Details */}
      <div className="grid grid-cols-2 gap-2">
        {nodes.slice(0, 4).map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-2 rounded-lg border text-xs ${
              node.risk === 'high'
                ? 'bg-threat-critical/10 border-threat-critical/30'
                : 'bg-warning-amber/10 border-warning-amber/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">{node.label}</span>
              <Lock className="w-3 h-3 text-neon-cyan" />
            </div>
            <p className="text-slate-400">
              {node.connections} connections
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
