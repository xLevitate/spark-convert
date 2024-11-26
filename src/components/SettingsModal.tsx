import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    preserveMetadata: boolean;
    compressionLevel: string;
  };
  onSettingsChange: (settings: {
    preserveMetadata: boolean;
    compressionLevel: string;
  }) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card rounded-xl p-6 w-full max-w-md relative z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Conversion Settings</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.preserveMetadata}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        preserveMetadata: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 text-amber-500 focus:ring-amber-500 bg-gray-800"
                  />
                  <span>Preserve metadata</span>
                </label>
                <p className="text-sm text-gray-400 mt-1 ml-6">
                  Keep original file information like creation date and author
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Compression Level
                </label>
                <select
                  value={settings.compressionLevel}
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      compressionLevel: e.target.value,
                    })
                  }
                  className="glass-card w-full px-3 py-2 rounded-lg border-0 text-sm
                           focus:border-amber-500 focus:ring-1 focus:ring-amber-500 
                           outline-none bg-transparent"
                >
                  <option value="none">None (Original quality)</option>
                  <option value="low">Low compression</option>
                  <option value="medium">Medium compression</option>
                  <option value="high">High compression</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onClose}
                className="btn-primary w-full"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
