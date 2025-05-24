import React from 'react';
import { Box, Paper, Typography, Avatar, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Message, FileAttachment } from '../../types';
import FileAttachmentComponent from './FileAttachment';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const theme = useTheme();
  
  if (messages.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
          p: 4,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Start a conversation by sending a message.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {messages.map((message) => (
        <Box
          key={message.id}
          sx={{
            display: 'flex',
            gap: 2,
            alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
          }}
        >
          {message.role !== 'user' && (
            <Avatar
              sx={{
                bgcolor: message.role === 'assistant' ? 'primary.main' : 'secondary.main',
                width: 36,
                height: 36,
              }}
            >
              {message.role === 'assistant' ? 'AI' : 'S'}
            </Avatar>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              {message.role === 'user' ? 'You' : message.role === 'assistant' ? 'Assistant' : 'System'}
            </Typography>
            
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: message.role === 'user' 
                  ? 'primary.main'
                  : theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
                color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
              }}
            >
              {/* File attachments (if any) */}
              {message.fileAttachments && message.fileAttachments.length > 0 && (
                <Box sx={{ mb: message.content ? 2 : 0 }}>
                  {message.fileAttachments.map((file) => (
                    <FileAttachmentComponent key={file.id} file={file} />
                  ))}
                </Box>
              )}
              
              {/* Message content */}
              {message.content && (
                <Box 
                  sx={{ 
                    '& pre': { 
                      borderRadius: 1,
                      p: 2, 
                      overflowX: 'auto',
                      backgroundColor: message.role === 'user' 
                        ? 'rgba(0, 0, 0, 0.1)' 
                        : theme.palette.mode === 'light' ? 'grey.200' : 'grey.900',
                    },
                    '& code': { 
                      backgroundColor: message.role === 'user' 
                        ? 'rgba(0, 0, 0, 0.1)' 
                        : theme.palette.mode === 'light' ? 'grey.200' : 'grey.900',
                      padding: '2px 4px',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    },
                    '& a': {
                      color: message.role === 'user' 
                        ? 'inherit'
                        : 'primary.main',
                      textDecoration: 'underline',
                    },
                    '& p': {
                      mt: 0,
                      mb: 1,
                      '&:last-child': {
                        mb: 0,
                      },
                    },
                    '& table': {
                      borderCollapse: 'collapse',
                      width: '100%',
                      mb: 2,
                    },
                    '& th, & td': {
                      border: `1px solid ${theme.palette.divider}`,
                      padding: '8px 12px',
                      textAlign: 'left',
                    },
                    '& th': {
                      backgroundColor: message.role === 'user' 
                        ? 'rgba(0, 0, 0, 0.1)' 
                        : theme.palette.mode === 'light' ? 'grey.200' : 'grey.900',
                    },
                    '& ul, & ol': {
                      paddingLeft: 3,
                      mb: 1,
                    },
                    '& blockquote': {
                      borderLeft: `4px solid ${theme.palette.divider}`,
                      marginLeft: 0,
                      paddingLeft: 2,
                      marginBottom: 1,
                    },
                  }}
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </Box>
              )}
            </Paper>
          </Box>
          
          {message.role === 'user' && (
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                width: 36,
                height: 36,
              }}
            >
              U
            </Avatar>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default MessageList;