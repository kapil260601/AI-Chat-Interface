import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import ChatView from './components/chat/ChatView';
import { initializeSampleData } from './utils/mockData';

// Component to initialize sample data
const DataInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // Initialize sample data if the app state is empty
    if (state.chats.length === 0 && state.folders.length === 0 && state.agents.length === 0) {
      const { folders, agents, chats } = initializeSampleData();
      
      // Add folders
      folders.forEach(folder => {
        dispatch({
          type: 'CREATE_FOLDER',
          payload: { name: folder.name },
        });
      });
      
      // Add agents
      agents.forEach(agent => {
        dispatch({
          type: 'CREATE_AGENT',
          payload: {
            name: agent.name,
            systemPrompt: agent.systemPrompt,
            model: agent.model,
            temperature: agent.temperature,
          },
        });
      });
      
      // Add chats
      chats.forEach(chat => {
        dispatch({
          type: 'CREATE_CHAT',
          payload: {
            title: chat.title,
            folderId: chat.folderId,
            agentId: chat.agentId,
          },
        });
        
        // Add messages to chat
        chat.messages.forEach(message => {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              chatId: chat.id,
              message: {
                role: message.role,
                content: message.content,
                fileAttachments: message.fileAttachments || [],
              },
            },
          });
        });
      });
    }
  }, [state.chats.length, state.folders.length, state.agents.length, dispatch]);

  return <>{children}</>;
};

function App() {
  return (
    <AppProvider>
      <DataInitializer>
        <Router>
          <CssBaseline />
          <Layout>
            <Routes>
              <Route path="/" element={<ChatView />} />
              <Route path="/chat/:chatId" element={<ChatView />} />
            </Routes>
          </Layout>
        </Router>
      </DataInitializer>
    </AppProvider>
  );
}

export default App;