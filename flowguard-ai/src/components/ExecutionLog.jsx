import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Bot, ChevronRight, AlertCircle, CheckCircle2, Loader } from 'lucide-react';

const logTypeConfig = {
  system: { icon: Terminal, color: 'text-slate-400', prefix: '[SYS]' },
  agent: { icon: Bot, color: 'text-neon-cyan', prefix: '[AML-7]' },
  alert: { icon: AlertCircle, color: 'text-crimson-alert', prefix: '[ALERT]' },
  action: { icon: CheckCircle2, color: 'text-acid-green', prefix: '[EXEC]' },
  processing: { icon: Loader, color: 'text-warning-amber', prefix: '[PROC]' }
};

function StreamingText({ text, speed = 30, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete, isComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-neon-cyan ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

export default function ExecutionLog({ logs, isPaused }) {
  const scrollRef = useRef(null);
  const [completedLogs, setCompletedLogs] = useState(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, completedLogs]);

  const handleLogComplete = (logId) => {
    setCompletedLogs(prev => new Set([...prev, logId]));
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700/50 bg-slate-800/30">
        <Bot className="w-4 h-4 text-neon-cyan" />
        <span className="text-neon-cyan font-semibold text-sm tracking-wider">
          AGENTIC EXECUTION LOG
        </span>
        <div className="ml-auto flex items-center gap-1">
          <motion.div
            animate={isPaused ? {} : { scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-2 h-2 rounded-full ${isPaused ? 'bg-slate-500' : 'bg-neon-cyan'}`}
          />
          <span className="text-xs text-slate-400">
            {isPaused ? 'PAUSED' : 'STREAMING'}
          </span>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-3 bg-slate-950/50"
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => {
            const config = logTypeConfig[log.type] || logTypeConfig.system;
            const Icon = config.icon;
            const isLatest = index === logs.length - 1;
            const isAnimating = isLatest && !completedLogs.has(log.id) && !isPaused;

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-2 ${
                  log.type === 'alert' ? 'bg-crimson-alert/10 -mx-4 px-4 py-2 border-l-2 border-crimson-alert' : ''
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color} ${
                  log.type === 'processing' ? 'animate-spin' : ''
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-bold ${config.color}`}>
                      {config.prefix}
                    </span>
                    <span className="text-xs text-slate-600">{log.timestamp}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${
                    log.type === 'alert' ? 'text-crimson-alert font-semibold' :
                    log.type === 'action' ? 'text-acid-green' :
                    'text-slate-300'
                  }`}>
                    {isAnimating ? (
                      <StreamingText
                        text={log.message}
                        speed={25}
                        onComplete={() => handleLogComplete(log.id)}
                      />
                    ) : (
                      <>
                        <ChevronRight className="inline w-3 h-3 mr-1 opacity-50" />
                        {log.message}
                      </>
                    )}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {logs.length === 0 && (
          <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
            <Terminal className="w-4 h-4 mr-2" />
            Awaiting agent initialization...
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-800/20 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Agent: <span className="text-neon-cyan">AML-7</span>
        </span>
        <span className="text-xs text-slate-500">
          Entries: <span className="text-white">{logs.length}</span>
        </span>
      </div>
    </div>
  );
}
