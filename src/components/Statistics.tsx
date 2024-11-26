import React from 'react';
import { motion } from 'framer-motion';
import { FileCheck, HardDrive, Clock } from 'lucide-react';
import { getStatistics } from '../utils/statistics';
import { formatFileSize } from '../utils/helpers';

export default function Statistics() {
  const [stats, setStats] = React.useState(getStatistics());

  React.useEffect(() => {
    const updateStats = () => setStats(getStatistics());
    window.addEventListener('storage', updateStats);
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => {
      window.removeEventListener('storage', updateStats);
      clearInterval(interval);
    };
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-3xl mx-auto mb-16">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card rounded-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-md font-bold">Total Conversions</p>
            <p className="text-sm text-gray-400">
              {stats.totalConversions.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-md font-bold">Total Size Processed</p>
            <p className="text-sm text-gray-400">
              {formatFileSize(stats.totalSize)}
            </p>
          </div>
        </div>

        <div className="glass-card rounded-lg p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-md font-bold">Last Conversion</p>
            <p className="text-sm text-gray-400">
              {formatDate(stats.lastConversion)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
