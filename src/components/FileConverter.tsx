import { useCallback, useState, lazy, Suspense } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Settings, Info } from 'lucide-react';
import { ConversionJob, SUPPORTED_FORMATS } from '../types/converter';
import { convertFile } from '../utils/converter';
import { updateStatistics } from '../utils/statistics';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import SettingsModal from './SettingsModal';
import BatchActions from './BatchActions';

const ConversionList = lazy(() => import('./ConversionList'));

export default function FileConverter() {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState('medium');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 10) {
        toast.error('Maximum 10 files allowed at once');
        acceptedFiles = acceptedFiles.slice(0, 10);
      }

      const newJobs = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        targetFormat: '',
        status: 'pending' as const,
        progress: 0,
        settings: {
          preserveMetadata,
          compressionLevel,
        },
      })) as ConversionJob[];

      setJobs((prev) => [...prev, ...newJobs]);
      toast.success(`Added ${acceptedFiles.length} file(s)`);
    },
    [preserveMetadata, compressionLevel]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDropRejected: () => toast.error('File too large. Maximum size is 100MB'),
  });

  const handleRemoveJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  const handleRemoveCompleted = useCallback(() => {
    setJobs((prev) => prev.filter((job) => job.status !== 'completed'));
  }, []);

  const handleRemoveAll = useCallback(() => {
    setJobs([]);
  }, []);

  const handleFormatChange = useCallback((id: string, format: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === id ? { ...job, targetFormat: format } : job
      )
    );
  }, []);

  const handleConvertAll = useCallback(async () => {
    const pendingJobs = jobs.filter(
      (job) => job.status === 'pending' && job.targetFormat
    );

    const toastId = toast.loading(
      `Converting ${pendingJobs.length} file(s)...`
    );

    for (const job of pendingJobs) {
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: 'converting' } : j))
      );

      try {
        const result = await convertFile(
          job.file,
          job.targetFormat,
          (progress) => {
            setJobs((prev) =>
              prev.map((j) => (j.id === job.id ? { ...j, progress } : j))
            );
          },
          job.settings
        );

        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id ? { ...j, status: 'completed', result } : j
          )
        );

        updateStatistics(job.file.size);

        const url = URL.createObjectURL(result);
        const a = document.createElement('a');
        const fileName = job.file.name.replace(/\.[^/.]+$/, '') + '-converted' + job.targetFormat;
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? { ...j, status: 'error', error: (error as Error).message }
              : j
          )
        );
      }
    }

    toast.success('Conversion completed!', { id: toastId });
  }, [jobs]);

  const hasPendingJobs = jobs.some(
    (job) => job.status === 'pending' && job.targetFormat
  );

  const hasCompletedJobs = jobs.some((job) => job.status === 'completed');

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        className="glass-card rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-gray-400">
              Maximum file size: 100MB
            </span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            title="Conversion Settings"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${
              isDragActive
                ? 'border-amber-500 bg-amber-500/10 scale-[1.02]'
                : 'border-gray-700 hover:border-amber-500/50 hover:bg-gray-800/30'
            }`}
        >
          <input {...getInputProps()} />
          <motion.div
            className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4"
            animate={{ scale: isDragActive ? 1.1 : 1 }}
          >
            <Upload className="w-8 h-8 text-amber-500" />
          </motion.div>
          <div className="space-y-2">
            <p className="text-xl font-medium">Drag & drop your files here</p>
            <p className="text-gray-400">or click to select files</p>
          </div>
        </div>

        <AnimatePresence>
          {jobs.length > 0 && (
            <motion.div
              className="mt-8 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BatchActions
                onRemoveCompleted={handleRemoveCompleted}
                onRemoveAll={handleRemoveAll}
                hasCompletedJobs={hasCompletedJobs}
                totalJobs={jobs.length}
              />

              <Suspense
                fallback={
                  <div className="text-center">Loading converter...</div>
                }
              >
                <ConversionList
                  jobs={jobs}
                  supportedFormats={SUPPORTED_FORMATS}
                  onRemove={handleRemoveJob}
                  onFormatChange={handleFormatChange}
                />
              </Suspense>

              {hasPendingJobs && (
                <motion.button
                  onClick={handleConvertAll}
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Convert All Files
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={{
          preserveMetadata,
          compressionLevel,
        }}
        onSettingsChange={(settings) => {
          setPreserveMetadata(settings.preserveMetadata);
          setCompressionLevel(settings.compressionLevel);
        }}
      />
    </div>
  );
}
