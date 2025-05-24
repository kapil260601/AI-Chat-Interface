import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppState, AppAction, Chat, Folder, Agent, Message, FileAttachment } from '../types';

// Initial state
const initialState: AppState = {
  chats: [],
  folders: [],
  agents: [],
  activeChat: null,
  activeFolder: null,
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  isStreaming: false,
};

// Load state from localStorage
const loadState = (): AppState => {
  try {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  let newState: AppState;

  switch (action.type) {
    case 'CREATE_FOLDER': {
      const newFolder: Folder = {
        id: uuidv4(),
        name: action.payload.name,
        createdAt: Date.now(),
      };
      newState = {
        ...state,
        folders: [...state.folders, newFolder],
        activeFolder: newFolder.id,
      };
      break;
    }

    case 'DELETE_FOLDER': {
      const updatedChats = state.chats.map(chat => 
        chat.folderId === action.payload.id ? { ...chat, folderId: null } : chat
      );
      newState = {
        ...state,
        folders: state.folders.filter(folder => folder.id !== action.payload.id),
        chats: updatedChats,
        activeFolder: state.activeFolder === action.payload.id ? null : state.activeFolder,
      };
      break;
    }

    case 'RENAME_FOLDER': {
      newState = {
        ...state,
        folders: state.folders.map(folder => 
          folder.id === action.payload.id ? { ...folder, name: action.payload.name } : folder
        ),
      };
      break;
    }

    case 'CREATE_CHAT': {
      const newChat: Chat = {
        id: uuidv4(),
        title: action.payload.title,
        folderId: action.payload.folderId || null,
        agentId: action.payload.agentId || null,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      newState = {
        ...state,
        chats: [...state.chats, newChat],
        activeChat: newChat.id,
      };
      break;
    }

    case 'DELETE_CHAT': {
      newState = {
        ...state,
        chats: state.chats.filter(chat => chat.id !== action.payload.id),
        activeChat: state.activeChat === action.payload.id ? null : state.activeChat,
      };
      break;
    }

    case 'RENAME_CHAT': {
      newState = {
        ...state,
        chats: state.chats.map(chat => 
          chat.id === action.payload.id ? { ...chat, title: action.payload.title } : chat
        ),
      };
      break;
    }

    case 'MOVE_CHAT_TO_FOLDER': {
      newState = {
        ...state,
        chats: state.chats.map(chat => 
          chat.id === action.payload.chatId ? { ...chat, folderId: action.payload.folderId } : chat
        ),
      };
      break;
    }

    case 'SET_ACTIVE_CHAT': {
      newState = {
        ...state,
        activeChat: action.payload.id,
      };
      break;
    }

    case 'SET_ACTIVE_FOLDER': {
      newState = {
        ...state,
        activeFolder: action.payload.id,
      };
      break;
    }

    case 'ADD_MESSAGE': {
      const message: Message = {
        id: uuidv4(),
        ...action.payload.message,
        timestamp: Date.now(),
      };
      
      newState = {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.id === action.payload.chatId) {
            // If this is the first message and chat has a generic title, update the title
            let updatedTitle = chat.title;
            if (chat.messages.length === 0 && chat.title === 'New Chat' && action.payload.message.role === 'user') {
              // Create a title from the first ~20 chars of the message
              updatedTitle = action.payload.message.content.substring(0, 20);
              if (action.payload.message.content.length > 20) updatedTitle += '...';
            }
            
            return {
              ...chat,
              messages: [...chat.messages, message],
              updatedAt: Date.now(),
              title: updatedTitle,
            };
          }
          return chat;
        }),
      };
      break;
    }

    case 'APPEND_TO_MESSAGE': {
      newState = {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.id === action.payload.chatId) {
            return {
              ...chat,
              messages: chat.messages.map(message => {
                if (message.id === action.payload.messageId) {
                  return {
                    ...message,
                    content: message.content + action.payload.content,
                  };
                }
                return message;
              }),
              updatedAt: Date.now(),
            };
          }
          return chat;
        }),
      };
      break;
    }

    case 'SET_STREAMING': {
      newState = {
        ...state,
        isStreaming: action.payload.isStreaming,
      };
      break;
    }

    case 'CREATE_AGENT': {
      const newAgent: Agent = {
        id: uuidv4(),
        ...action.payload,
        createdAt: Date.now(),
      };
      newState = {
        ...state,
        agents: [...state.agents, newAgent],
      };
      break;
    }

    case 'DELETE_AGENT': {
      // Remove agent from chats that use it
      const updatedChats = state.chats.map(chat => 
        chat.agentId === action.payload.id ? { ...chat, agentId: null } : chat
      );
      
      newState = {
        ...state,
        agents: state.agents.filter(agent => agent.id !== action.payload.id),
        chats: updatedChats,
      };
      break;
    }

    case 'TOGGLE_DARK_MODE': {
      newState = {
        ...state,
        darkMode: !state.darkMode,
      };
      break;
    }

    case 'ADD_FILE_TO_MESSAGE': {
      const fileAttachment: FileAttachment = {
        id: uuidv4(),
        ...action.payload.file,
      };

      newState = {
        ...state,
        chats: state.chats.map(chat => {
          if (chat.id === action.payload.chatId) {
            return {
              ...chat,
              messages: chat.messages.map(message => {
                if (message.id === action.payload.messageId) {
                  return {
                    ...message,
                    fileAttachments: [...(message.fileAttachments || []), fileAttachment],
                  };
                }
                return message;
              }),
              updatedAt: Date.now(),
            };
          }
          return chat;
        }),
      };
      break;
    }

    default:
      return state;
  }

  // Save state to localStorage
  localStorage.setItem('appState', JSON.stringify(newState));
  return newState;
};

// Create context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Context provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, loadState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  // Apply dark mode
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-mode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-mode', 'light');
    }
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);