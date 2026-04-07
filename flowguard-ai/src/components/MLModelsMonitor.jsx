import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, CheckCircle2, Zap } from 'lucide-react';

export default function MLModelsMonitor() {
  const models = [
    {
      name: 'Isolation Forest',
      accuracy: 94.7,
      falsePositives: 1.2,
      detections: 187,
      lastTrained: '2 hours ago',
      status: 'active'
    },
    {
      name: 'Z-Score Analysis',
      accuracy: 92.3,
      falsePositives: 2.1,
      detections: 156,
      lastTrained: '4 hours ago',
      status: 'active'
    },
    {
      name: 'Benford\'s Law Detection',
      accuracy: 88.9,
      falsePositives: 3.4,
      detections: 124,
      lastTrained: '1 hour ago',
      status: 'active'
    },
    {
      name: 'Neural Network Classifier',
      accuracy: 96.5,
      falsePositives: 0.8,
      detections: 203,
      lastTrained: '30 mins ago',
      status: 'training'
    }
  ];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <h4 className="text-sm font-bold text-neon-cyan flex items-center gap-2">
          <Brain className="w-4 h-4" />
          ML Model Performance
        </h4>
        <span className="text-xs text-slate-500">Ensemble Learning</span>
      </motion.div>

      <div className="space-y-3">
        {models.map((model, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-neon-cyan/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h5 className="font-bold text-white text-sm mb-1">{model.name}</h5>
                <p className="text-xs text-slate-400">
                  {model.detections} detections • Last trained {model.lastTrained}
                </p>
              </div>
              <motion.div
                animate={{
                  scale: model.status === 'training' ? [1, 1.1, 1] : 1,
                  opacity: model.status === 'training' ? [0.6, 1, 0.6] : 1
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  model.status === 'training'
                    ? 'bg-neon-cyan/20 text-neon-cyan'
                    : 'bg-acid-green/20 text-acid-green'
                }`}
              >
                {model.status === 'training' ? 'TRAINING' : 'ACTIVE'}
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500 mb-1">Accuracy</p>
                <p className="font-bold text-neon-cyan text-lg">{model.accuracy}%</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">False Positives</p>
                <p className="font-bold text-warning-amber text-lg">{model.falsePositives}%</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Detections</p>
                <p className="font-bold text-acid-green text-lg">{model.detections}</p>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-3 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${model.accuracy}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
                className="h-full bg-gradient-to-r from-neon-cyan to-acid-green"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Model Ensemble Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-xs text-slate-300 space-y-2"
      >
        <div className="font-bold text-neon-cyan mb-2">Ensemble Strategy</div>
        <p>✓ Voting-based consensus for improved accuracy</p>
        <p>✓ Real-time model retraining every 4 hours</p>
        <p>✓ Continuous performance monitoring active</p>
      </motion.div>
    </div>
  );
}
