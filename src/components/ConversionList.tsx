import { FileType, ArrowRight, X, Check, AlertCircle } from 'lucide-react';
import { ConversionJob, SUPPORTED_FORMATS } from '../types/converter';
import { formatFileSize } from '../utils/helpers';

interface ConversionListProps {
  jobs: ConversionJob[];
  supportedFormats: typeof SUPPORTED_FORMATS;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: string) => void;
}

export default function ConversionList({
  jobs,
  supportedFormats,
  onRemove,
  onFormatChange,
}: ConversionListProps) {
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="glass-card rounded-lg p-4 relative group"
        >
          {job.status === 'pending' && (
            <button
              onClick={() => onRemove(job.id)}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-gray-800 border border-gray-700/50 
                       hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 z-10
                       opacity-0 group-hover:opacity-100 shadow-lg"
              aria-label="Remove file"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
            </button>
          )}

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <FileType className="w-5 h-5 text-amber-500" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{job.file.name}</p>
              <p className="text-xs text-gray-400">
                {formatFileSize(job.file.size)}
              </p>
            </div>

            {job.status === 'pending' ? (
              <>
                <ArrowRight className="w-5 h-5 text-gray-500" />
                <select
                  value={job.targetFormat}
                  onChange={(e) => onFormatChange(job.id, e.target.value)}
                  className="glass-card px-3 py-2 rounded-lg border-0 text-sm
                             focus:border-amber-500 focus:ring-1 focus:ring-amber-500 
                             outline-none bg-transparent cursor-pointer"
                >
                  <option value="">Select format</option>
                  {supportedFormats[job.file.type as keyof typeof supportedFormats]?.map(
                    (format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    )
                  )}
                </select>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {job.status === 'converting' && (
                  <div className="text-sm text-amber-500 font-medium">
                    {Math.round(job.progress)}%
                  </div>
                )}
                {job.status === 'completed' && (
                  <div className="flex items-center gap-1.5 text-green-500">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Done</span>
                  </div>
                )}
                {job.status === 'error' && (
                  <div className="flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{job.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {job.status === 'converting' && (
            <div className="mt-3 h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
