import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface BatchActionsProps {
  onRemoveCompleted: () => void;
  onRemoveAll: () => void;
  hasCompletedJobs: boolean;
  totalJobs: number;
}

export default function BatchActions({
  onRemoveCompleted,
  onRemoveAll,
  hasCompletedJobs,
  totalJobs,
}: BatchActionsProps) {
  if (totalJobs === 0) return null;

  return (
    <motion.div 
      className="flex justify-end gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {hasCompletedJobs && (
        <button
          onClick={onRemoveCompleted}
          className="btn-secondary text-sm py-2"
        >
          Clear Completed
        </button>
      )}
      <button
        onClick={onRemoveAll}
        className="btn-secondary text-sm py-2 text-red-400 hover:text-red-300"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
