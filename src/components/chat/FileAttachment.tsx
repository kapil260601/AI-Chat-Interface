import React from 'react';
import { Box, Paper, Typography, Link } from '@mui/material';
import { FileText, Image, FilePlus } from 'lucide-react';
import { FileAttachment } from '../../types';
import fileService from '../../services/fileService';

interface FileAttachmentProps {
  file: FileAttachment;
}

const FileAttachmentComponent: React.FC<FileAttachmentProps> = ({ file }) => {
  // Get file category to determine display
  const fileCategory = fileService.getFileCategory(file.type);
  
  // Render the appropriate file preview
  const renderFilePreview = () => {
    switch (fileCategory) {
      case 'image':
        return (
          <Box sx={{ mb: 1 }}>
            <img
              src={file.url}
              alt={file.name}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: 8,
                objectFit: 'contain',
              }}
            />
          </Box>
        );
      case 'document':
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
            }}
          >
            <FileText size={20} />
            <Typography variant="body2" fontWeight={500}>
              {file.type.includes('pdf') ? 'PDF Document' : 'Word Document'}
            </Typography>
          </Box>
        );
      default:
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
            }}
          >
            <FilePlus size={20} />
            <Typography variant="body2" fontWeight={500}>
              File
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
      }}
    >
      {renderFilePreview()}
      
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fileService.formatFileSize(file.size)}
        </Typography>
      </Box>
      
      {/* If this were a real app, we'd add download/preview options here */}
      <Link
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ fontSize: '0.75rem', display: 'block', mt: 0.5 }}
      >
        View file
      </Link>
    </Paper>
  );
};

export default FileAttachmentComponent;