import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import WelcomeScreen from './WelcomeScreen';
import mockWebSocket from '../../services/mockWebSocket';

const ChatView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const activeChat = state.chats.find(chat => chat.id === state.activeChat);
  const activeAgent = activeChat?.agentId 
    ? state.agents.find(agent => agent.id === activeChat.agentId)
    : null;

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Connect to WebSocket when component mounts
  useEffect(() => {
    const connectWebSocket = async () => {
      setIsConnecting(true);
      try {
        await mockWebSocket.connect();
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    connectWebSocket();

    // Clean up WebSocket connection when component unmounts
    return () => {
      mockWebSocket.close();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Handle sending a message
  // const handleSendMessage = async (content: string, files?: File[]) => {
  //   if (!state.activeChat) return;
    
  //   // Create user message
  //   const userMessageId = crypto.randomUUID();
  //   dispatch({
  //     type: 'ADD_MESSAGE',
  //     payload: {
  //       chatId: state.activeChat,
  //       message: {
  //         role: 'user',
  //         content,
  //         fileAttachments: [],
  //       },
  //     },
  //   });

  //   // Process files if any
  //   if (files && files.length > 0) {
  //     for (const file of files) {
  //       try {
  //         const fileData = await fileService.uploadFile(file);
  //         dispatch({
  //           type: 'ADD_FILE_TO_MESSAGE',
  //           payload: {
  //             chatId: state.activeChat,
  //             messageId: userMessageId,
  //             file: fileData,
  //           },
  //         });
  //       } catch (error) {
  //         console.error('Failed to upload file:', error);
  //       }
  //     }
  //   }

  //   // Create empty assistant message to stream into
  //   const assistantMessageId = crypto.randomUUID();
  //   dispatch({
  //     type: 'ADD_MESSAGE',
  //     payload: {
  //       chatId: state.activeChat,
  //       message: {
  //         id: assistantMessageId,
  //         role: 'assistant',
  //         content: '',
  //       },
  //     },
  //   });

  //   // Start streaming
  //   dispatch({ type: 'SET_STREAMING', payload: { isStreaming: true } });

  //   try {
  //     // Send message to mock WebSocket
  //     mockWebSocket
  //       .onMessage((token) => {
  //         // Append token to the assistant message
  //         dispatch({
  //           type: 'APPEND_TO_MESSAGE',
  //           payload: {
  //             chatId: state.activeChat,
  //             messageId: assistantMessageId,
  //             content: token,
  //           },
  //         });
  //       })
  //       .sendMessage(content, activeAgent?.id);
  //   } catch (error) {
  //     console.error('Failed to send message:', error);
  //   } finally {
  //     // Stop streaming
  //     setTimeout(() => {
  //       dispatch({ type: 'SET_STREAMING', payload: { isStreaming: false } });
  //     }, 500);
  //   }
  // };

  const handleSendMessage = async (content: string, files?: File[]) => {
  if (!state.activeChat) return;

  const userMessageId = crypto.randomUUID();
  const assistantMessageId = crypto.randomUUID();

  // 1. Add user's message
  dispatch({
    type: 'ADD_MESSAGE',
    payload: {
      chatId: state.activeChat,
      message: {
        id: userMessageId,
        role: 'user',
        content,
        fileAttachments: [],
      },
    },
  });

  // 2. Add assistant placeholder message
  dispatch({
    type: 'ADD_MESSAGE',
    payload: {
      chatId: state.activeChat,
      message: {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
      },
    },
  });

  // 3. Upload files if any
  if (files && files.length > 0) {
    for (const file of files) {
      try {
        const fileData = await fileService.uploadFile(file);
        dispatch({
          type: 'ADD_FILE_TO_MESSAGE',
          payload: {
            chatId: state.activeChat,
            messageId: userMessageId,
            file: fileData,
          },
        });
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
  }

  dispatch({ type: 'SET_STREAMING', payload: { isStreaming: true } });

  try {
    const { messageId: wsMessageId } = mockWebSocket
      .onMessage((token, messageId) => {
        // Only update the message we just created
        if (messageId === wsMessageId) {
          dispatch({
            type: 'APPEND_TO_MESSAGE',
            payload: {
              chatId: state.activeChat,
              messageId: assistantMessageId,
              content: token,
            },
          });
        }
      })
      .sendMessage(content, activeAgent?.id);
  } catch (error) {
    console.error('WebSocket send failed:', error);
  } finally {
    setTimeout(() => {
      dispatch({ type: 'SET_STREAMING', payload: { isStreaming: false } });
    }, 500);
  }
};


  // Stop the assistant from responding
  const handleStopGeneration = () => {
    mockWebSocket.stopStreaming();
    dispatch({ type: 'SET_STREAMING', payload: { isStreaming: false } });
  };

  // If no chat is active, show welcome screen
  if (!activeChat) {
    return <WelcomeScreen />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Chat header */}
      <Paper
        elevation={0}
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'customBorder.main',
          bgcolor: 'customBackground.paper',
          zIndex: 10,
        }}
      >
        <Typography variant="h6" noWrap>
          {activeChat.title}
        </Typography>
        {activeAgent && (
          <Typography variant="caption" color="text.secondary">
            Using agent: {activeAgent.name}
          </Typography>
        )}
      </Paper>

      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MessageList messages={activeChat.messages} />
        <div ref={messagesEndRef} />
      </Box>

      {/* Connecting indicator */}
      {isConnecting && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Connecting...
          </Typography>
        </Box>
      )}

      {/* Chat input */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderTop: 1,
          borderColor: 'customBorder.main',
          bgcolor: 'customBackground.paper',
        }}
      >
        <ChatInput
          onSendMessage={handleSendMessage}
          onStopGeneration={handleStopGeneration}
          isStreaming={state.isStreaming}
        />
      </Box>
    </Box>
  );
};

export default ChatView;