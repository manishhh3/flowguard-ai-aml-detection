import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Zap, Signal, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SystemHealth() {
  const services = [
    { name: 'Main Engine', status: 'healthy', uptime: '99.99%', latency: '2.1ms' },
    { name: 'Database Cluster', status: 'healthy', uptime: '99.98%', latency: '1.8ms' },
    { name: 'Cache Layer', status: 'healthy', uptime: '100%', latency: '0.3ms' },
    { name: 'API Gateway', status: 'healthy', uptime: '99.97%', latency: '3.2ms' },
    { name: 'ML Services', status: 'healthy', uptime: '99.99%', latency: '45.6ms' },
    { name: 'Message Queue', status: 'healthy', uptime: '99.99%', latency: '0.8ms' }
  ];

  const resources = [
    { name: 'CPU', usage: 34, limit: 100, unit: '%' },
    { name: 'Memory', usage: 2.1, limit: 8, unit: 'GB' },
    { name: 'Disk', usage: 156, limit: 500, unit: 'GB' },
    { name: 'Network', usage: 245, limit: 1000, unit: 'Mbps' }
  ];

  return (
    <div className="space-y-6">
      {/* Services Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h4 className="text-sm font-bold text-neon-cyan flex items-center gap-2">
          <Server className="w-4 h-4" />
          Service Status
        </h4>

        <div className="space-y-2">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-acid-green" />
                  <span className="text-sm font-bold text-white">{service.name}</span>
                </div>
                <div className="text-xs text-slate-400 ml-6 space-y-0.5">
                  <p>Uptime: {service.uptime}</p>
                  <p>Latency: {service.latency}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-acid-green bg-acid-green/10 px-2 py-1 rounded">
                OK
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resource Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h4 className="text-sm font-bold text-neon-cyan flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Resource Utilization
        </h4>

        <div className="space-y-3">
          {resources.map((resource, i) => {
            const percentage = (resource.usage / resource.limit) * 100;
            const isHigh = percentage > 70;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{resource.name}</span>
                  <span className={`font-bold ${isHigh ? 'text-warning-amber' : 'text-neon-cyan'}`}>
                    {resource.usage} / {resource.limit} {resource.unit}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`h-full rounded-full ${
                      isHigh
                        ? 'bg-gradient-to-r from-warning-amber to-threat-critical'
                        : 'bg-gradient-to-r from-neon-cyan to-acid-green'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-3 bg-acid-green/10 border border-acid-green/30 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-acid-green" />
          <span className="text-sm font-bold text-acid-green">System Status</span>
        </div>
        <p className="text-xs text-slate-300">All systems operational. No alerts.</p>
      </motion.div>
    </div>
  );
}
