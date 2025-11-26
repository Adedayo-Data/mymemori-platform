import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Check, 
  Loader2, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { uploadQueueManager } from '../utils/uploadQueueManager';
import type { UploadTask, QueueStatus } from '../utils/uploadQueueManager';
import { formatFileSize } from '../utils/imageCompressionUtils';

interface FloatingUploadIndicatorProps {
  onTaskComplete?: (task: UploadTask) => void;
}

const FloatingUploadIndicator = ({ onTaskComplete }: FloatingUploadIndicatorProps) => {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Subscribe to queue updates
    const unsubscribe = uploadQueueManager.subscribe((status) => {
      setQueueStatus(status);
      
      // Auto-expand when uploads start
      if (status.isProcessing && !isExpanded) {
        setIsExpanded(true);
      }
    });

    // Set upload complete callback
    if (onTaskComplete) {
      uploadQueueManager.setOnUploadComplete(onTaskComplete);
    }

    return () => {
      unsubscribe();
    };
  }, [onTaskComplete, isExpanded]);

  // Don't show if no tasks
  if (!queueStatus || queueStatus.totalTasks === 0) {
    return null;
  }

  const { tasks, isProcessing, completedTasks, failedTasks, totalTasks } = queueStatus;
  const overallProgress = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]"
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : completedTasks === totalTasks && failedTasks === 0 ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isProcessing 
                    ? `Uploading ${completedTasks + 1}/${totalTasks}` 
                    : failedTasks > 0
                    ? `${failedTasks} Failed`
                    : 'Upload Complete'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronUp className="w-5 h-5" />
                  )}
                </button>
                {!isProcessing && (
                  <button
                    onClick={() => uploadQueueManager.clearCompleted()}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-3">
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 text-white/90">
                <span>{completedTasks} completed</span>
                <span>{overallProgress}%</span>
              </div>
            </div>
          </div>

          {/* Task List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                  {tasks.map((task) => (
                    <UploadTaskItem
                      key={task.id}
                      task={task}
                      onRetry={() => uploadQueueManager.retryTask(task.id)}
                      onRemove={() => uploadQueueManager.removeTask(task.id)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Individual task item component
const UploadTaskItem = ({
  task,
  onRetry,
  onRemove,
}: {
  task: UploadTask;
  onRetry: () => void;
  onRemove: () => void;
}) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'pending':
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
      case 'compressing':
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-pink-500 animate-spin" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case 'pending':
        return 'Waiting...';
      case 'compressing':
        return 'Compressing...';
      case 'uploading':
        return 'Uploading...';
      case 'success':
        return 'Uploaded';
      case 'error':
        return task.error || 'Failed';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-gray-50 rounded-lg p-3"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getStatusIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {task.fileName}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(task.fileSize)} • {getStatusText()}
          </p>
          
          {/* Progress bar for active uploads */}
          {(task.status === 'compressing' || task.status === 'uploading') && (
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${task.progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          {task.status === 'error' && (
            <button
              onClick={onRetry}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Retry upload"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {task.status !== 'uploading' && task.status !== 'compressing' && (
            <button
              onClick={onRemove}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Remove"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingUploadIndicator;
