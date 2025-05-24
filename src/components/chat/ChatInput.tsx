import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Paperclip, Send, Square, AlertCircle } from 'lucide-react';
import fileService from '../../services/fileService';

interface ChatInputProps {
  onSendMessage: (content: string, files?: File[]) => void;
  onStopGeneration: () => void;
  isStreaming: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopGeneration,
  isStreaming,
}) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the input field
  useEffect(() => {
    if (textFieldRef.current && !isStreaming) {
      textFieldRef.current.focus();
    }
  }, [isStreaming]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate files
    for (const file of selectedFiles) {
      const validation = fileService.validateFile(file);
      if (!validation.valid) {
        setFileError(validation.error || 'Invalid file');
        return;
      }
    }
    
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove a file from the selection
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle sending a message
  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
    }
  };

  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {/* File preview */}
      {files.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {files.map((file, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                gap: 1,
              }}
            >
              <Typography variant="body2" noWrap sx={{ maxWidth: '150px' }}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({fileService.formatFileSize(file.size)})
              </Typography>
              <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                <Square size={16} />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}

      {/* File error message */}
      {fileError && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 1,
            borderRadius: 1,
            bgcolor: 'error.light',
            color: 'error.contrastText',
          }}
        >
          <AlertCircle size={16} />
          <Typography variant="body2">{fileError}</Typography>
        </Box>
      )}

      {/* Input field */}
      <Paper
        variant="outlined"
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          p: 1,
          borderRadius: 2,
          bgcolor: 'customBackground.input',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder={isStreaming ? 'Wait for the response to complete...' : 'Type a message...'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          inputRef={textFieldRef}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              p: 1,
              fontSize: '0.95rem',
            },
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          {/* File upload button */}
          <Tooltip title="Attach file">
            <IconButton
              disabled={isStreaming}
              onClick={() => fileInputRef.current?.click()}
              size="small"
              sx={{ mr: 1 }}
            >
              <Paperclip size={20} />
            </IconButton>
          </Tooltip>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.docx"
          />

          {/* Send/Stop button */}
          {isStreaming ? (
            <Button
              variant="contained"
              color="error"
              onClick={onStopGeneration}
              startIcon={<Square size={20} />}
              sx={{ minWidth: '90px' }}
            >
              Stop
            </Button>
          ) : (
            <Button
              variant="contained"
              disabled={!message.trim() && files.length === 0}
              onClick={handleSend}
              startIcon={<Send size={20} />}
            >
              Send
            </Button>
          )}
        </Box>
      </Paper>

      {/* Streaming indicator */}
      {isStreaming && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            AI is responding...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatInput;