import { compressImage } from './imageCompressionUtils';
import { uploadToCloudinary } from './upload';
import toast from 'react-hot-toast';

/**
 * Status of an upload task
 */
export type UploadStatus = 'pending' | 'compressing' | 'uploading' | 'success' | 'error';

/**
 * Individual upload task
 */
export interface UploadTask {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  status: UploadStatus;
  progress: number; // 0-100
  imageUrl?: string;
  error?: string;
  metadata: UploadMetadata;
}

/**
 * Metadata for upload
 */
export interface UploadMetadata {
  eventSlug: string;
  sessionId?: string;
  isAuthenticated: boolean;
}

/**
 * Queue status
 */
export interface QueueStatus {
  tasks: UploadTask[];
  isProcessing: boolean;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
}

/**
 * Upload Queue Manager - Handles background uploads
 */
class UploadQueueManager {
  private queue: UploadTask[] = [];
  private isProcessing = false;
  private listeners: Set<(status: QueueStatus) => void> = new Set();
  private onUploadComplete?: (task: UploadTask) => void;

  /**
   * Subscribe to queue status updates
   */
  subscribe(listener: (status: QueueStatus) => void): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  /**
   * Set callback for when an upload completes successfully
   */
  setOnUploadComplete(callback: (task: UploadTask) => void): void {
    this.onUploadComplete = callback;
  }

  /**
   * Add files to the upload queue
   */
  async addToQueue(files: File[], metadata: UploadMetadata): Promise<void> {
    const newTasks: UploadTask[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      fileName: file.name,
      fileSize: file.size,
      status: 'pending' as UploadStatus,
      progress: 0,
      metadata,
    }));

    this.queue.push(...newTasks);
    this.notifyListeners();

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }

    toast.success(
      `${files.length} photo${files.length > 1 ? 's' : ''} added to queue. Please stay on this page until uploads complete!`,
      { duration: 5000, icon: '📸' }
    );
  }

  /**
   * Process the upload queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.notifyListeners();

    let completedCount = 0;
    let failedCount = 0;

    while (this.queue.length > 0) {
      const task = this.queue[0];
      
      try {
        await this.processTask(task);
        if (task.status === 'success') {
          completedCount++;
        } else if (task.status === 'error') {
          failedCount++;
        }
      } catch {
        failedCount++;
      }

      // Remove completed task from queue
      this.queue.shift();
      this.notifyListeners();
    }

    this.isProcessing = false;
    this.notifyListeners();

    // Show completion toast with correct counts
    if (failedCount === 0 && completedCount > 0) {
      toast.success(`All ${completedCount} photo${completedCount > 1 ? 's' : ''} uploaded successfully!`);
    } else if (failedCount > 0) {
      if (completedCount > 0) {
        toast.error(`${failedCount} photo(s) failed, ${completedCount} succeeded`);
      } else {
        toast.error(`All ${failedCount} photo(s) failed to upload`);
      }
    }
  }

  /**
   * Process a single upload task
   */
  private async processTask(task: UploadTask): Promise<void> {
    try {
      // Step 1: Compress image
      task.status = 'compressing';
      task.progress = 10;
      this.notifyListeners();

      const compressedFile = await compressImage(task.file);
      task.progress = 40;
      this.notifyListeners();

      // Step 2: Upload to Cloudinary
      task.status = 'uploading';
      task.progress = 50;
      this.notifyListeners();

      const imageUrl = await uploadToCloudinary(compressedFile);
      task.progress = 80;
      this.notifyListeners();

      // Step 3: Save to backend (if needed)
      // This would be handled by the component using the uploaded URL
      task.imageUrl = imageUrl;
      task.status = 'success';
      task.progress = 100;
      this.notifyListeners();

      // Notify completion
      if (this.onUploadComplete) {
        this.onUploadComplete(task);
      }

    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Upload failed';
      task.progress = 0;
      this.notifyListeners();
    }
  }

  /**
   * Get current queue status
   */
  getStatus(): QueueStatus {
    const allTasks = [...this.queue];
    const completedTasks = allTasks.filter(t => t.status === 'success').length;
    const failedTasks = allTasks.filter(t => t.status === 'error').length;

    return {
      tasks: allTasks,
      isProcessing: this.isProcessing,
      totalTasks: allTasks.length,
      completedTasks,
      failedTasks,
    };
  }

  /**
   * Retry a failed task
   */
  async retryTask(taskId: string): Promise<void> {
    const task = this.queue.find(t => t.id === taskId);
    if (task && task.status === 'error') {
      task.status = 'pending';
      task.progress = 0;
      task.error = undefined;
      this.notifyListeners();

      if (!this.isProcessing) {
        this.processQueue();
      }
    }
  }

  /**
   * Remove a task from the queue
   */
  removeTask(taskId: string): void {
    const index = this.queue.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.notifyListeners();
    }
  }

  /**
   * Clear all completed tasks
   */
  clearCompleted(): void {
    this.queue = this.queue.filter(t => t.status !== 'success');
    this.notifyListeners();
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(): void {
    const status = this.getStatus();
    this.listeners.forEach(listener => listener(status));
  }
}

// Export singleton instance
export const uploadQueueManager = new UploadQueueManager();
