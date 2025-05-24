import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { MessageSquarePlus, Code, TrendingUp, HelpCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const WelcomeScreen: React.FC = () => {
  const { dispatch } = useAppContext();

  // Create a new chat
  const handleCreateChat = () => {
    dispatch({
      type: 'CREATE_CHAT',
      payload: {
        title: 'New Chat',
        folderId: null,
        agentId: null,
      },
    });
  };

  // Example queries to start a conversation
  const exampleQueries = [
    {
      text: 'Analyze recent tech stock trends',
      icon: <TrendingUp size={20} />,
    },
    {
      text: 'Help me with React TypeScript code',
      icon: <Code size={20} />,
    },
    {
      text: 'Explain machine learning concepts',
      icon: <HelpCircle size={20} />,
    },
  ];

  // Start a new chat with an example query
  const handleExampleClick = (query: string) => {
    // Create a new chat
    const chatAction = {
      type: 'CREATE_CHAT' as const,
      payload: {
        title: query,
        folderId: null,
        agentId: null,
      },
    };
    
    dispatch(chatAction);
    
    // We need to wait for the chat to be created before adding a message
    setTimeout(() => {
      // Get the active chat ID
      const state = JSON.parse(localStorage.getItem('appState') || '{}');
      const activeChatId = state.activeChat;
      
      if (activeChatId) {
        // Add the example query as a message
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            chatId: activeChatId,
            message: {
              role: 'user',
              content: query,
              fileAttachments: [],
            },
          },
        });
      }
    }, 50);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          bgcolor: 'customBackground.paper',
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Welcome to AI Chat
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Start a new conversation with your AI assistant or try one of the example queries below.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<MessageSquarePlus size={20} />}
          onClick={handleCreateChat}
          sx={{ mb: 4, mt: 1 }}
        >
          New Chat
        </Button>
        
        <Typography variant="h6" gutterBottom>
          Example queries
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 2,
          }}
        >
          {exampleQueries.map((example, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={example.icon}
              onClick={() => handleExampleClick(example.text)}
              sx={{
                py: 1.5,
                justifyContent: 'flex-start',
                textAlign: 'left',
              }}
            >
              {example.text}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default WelcomeScreen;