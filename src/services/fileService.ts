// Mock file service for handling file uploads and storage

import { v4 as uuidv4 } from 'uuid';
import type { FileAttachment } from '../types';

const ALLOWED_FILE_TYPES = [
  'application/pdf',                                           // PDF
  'image/jpeg', 'image/jpg', 'image/png',                      // Images
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

class FileService {
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Allowed types: PDF, JPEG, PNG, DOCX',
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: 'File too large. Maximum size: 10MB',
      };
    }

    return { valid: true };
  }

  // Create a blob URL for the file (in a real app, you'd upload to a server)
  async uploadFile(file: File): Promise<Omit<FileAttachment, 'id'>> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create a blob URL for local preview
    const url = URL.createObjectURL(file);
    
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      url,
    };
  }

  // Get file type category (image, document, etc.)
  getFileCategory(fileType: string): 'image' | 'document' | 'unknown' {
    if (fileType.startsWith('image/')) {
      return 'image';
    } else if (
      fileType === 'application/pdf' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return 'document';
    }
    
    return 'unknown';
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }

  // Clean up blob URLs when they're no longer needed
  revokeFileUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

// Singleton instance
const fileService = new FileService();

export default fileService;