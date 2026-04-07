import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Download, Trash2 } from 'lucide-react';

export default function UploadPanel({ onFileUpload, onTransactionsImport }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const processFile = (file) => {
    if (!file.name.match(/\.(csv|xlsx|xls|json)$/i)) {
      setUploadStatus({ type: 'error', message: 'Please upload CSV, Excel, or JSON files' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let transactions = [];
        
        if (file.name.endsWith('.json')) {
          transactions = JSON.parse(e.target.result);
        } else if (file.name.endsWith('.csv')) {
          const lines = e.target.result.split('\n');
          const headers = lines[0].split(',');
          transactions = lines.slice(1).map(line => {
            const values = line.split(',');
            return {
              txnId: values[0],
              amount: parseFloat(values[2]) || 0,
              status: 'ANALYZING',
              time: new Date().toLocaleTimeString()
            };
          }).filter(t => t.txnId);
        }

        if (transactions.length > 0) {
          setUploadedFiles(prev => [...prev, {
            name: file.name,
            size: file.size,
            uploadTime: new Date(),
            count: transactions.length,
            status: 'success'
          }]);
          setUploadStatus({ type: 'success', message: `Uploaded ${transactions.length} transactions` });
          onTransactionsImport(transactions);
        }
      } catch (error) {
        setUploadStatus({ type: 'error', message: 'Error parsing file' });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const csv = `Transaction_ID,Timestamp,Amount_INR,Source_Account,Destination_Account,Currency
TXN-001,2024-01-15 10:30:00,50000,ACC-1234,ACC-5678,INR
TXN-002,2024-01-15 10:35:00,45000,ACC-1111,ACC-2222,INR`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_template.csv';
    a.click();
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950/40">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer
          ${dragActive 
            ? 'border-neon-cyan bg-neon-cyan/5 scale-105' 
            : 'border-slate-700/50 bg-slate-800/20 hover:border-neon-cyan/50'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept=".csv,.xlsx,.xls,.json"
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4 text-center">
          <motion.div
            animate={{ scale: dragActive ? 1.2 : 1 }}
            className="p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30"
          >
            <Upload className="w-8 h-8 text-neon-cyan" />
          </motion.div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Upload Transaction Data</h3>
            <p className="text-sm text-slate-400">Drag & drop CSV, Excel, or JSON files</p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan rounded-lg font-bold text-sm hover:bg-neon-cyan/30 transition-all"
          >
            Select File
          </button>
        </div>
      </motion.div>

      {/* Template Download */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        onClick={downloadTemplate}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-acid-green/10 border border-acid-green/30 text-acid-green rounded-lg font-bold text-sm hover:bg-acid-green/20 transition-all"
      >
        <Download className="w-4 h-4" />
        Download CSV Template
      </motion.button>

      {/* Status Message */}
      <AnimatePresence>
        {uploadStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg flex items-center gap-3 ${
              uploadStatus.type === 'success'
                ? 'bg-acid-green/10 border border-acid-green/30'
                : 'bg-threat-critical/10 border border-threat-critical/30'
            }`}
          >
            {uploadStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-acid-green flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-threat-critical flex-shrink-0" />
            )}
            <span className={uploadStatus.type === 'success' ? 'text-acid-green' : 'text-threat-critical'}>
              {uploadStatus.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-bold text-neon-cyan mb-3">Recent Uploads</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-4 h-4 text-neon-cyan" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono text-slate-300 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{file.count} transactions • {(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-acid-green flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 text-xs text-slate-400 space-y-2">
        <p className="font-bold text-neon-cyan mb-2">File Requirements:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Max file size: 50MB</li>
          <li>Supported formats: CSV, Excel (.xlsx, .xls), JSON</li>
          <li>Must include: Transaction ID, Amount, Account details</li>
          <li>CSV headers: Transaction_ID, Timestamp, Amount_INR, Source_Account, Destination_Account</li>
        </ul>
      </div>
    </div>
  );
}
