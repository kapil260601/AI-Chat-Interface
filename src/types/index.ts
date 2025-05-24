export type ChatRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  fileAttachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // For mocked file storage - would be a blob URL
}

export interface Chat {
  id: string;
  title: string;
  folderId: string | null;
  agentId: string | null;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Agent {
  id: string;
  name: string;
  systemPrompt: string;
  model: 'gpt-3.5-turbo' | 'gpt-4';
  temperature: number;
  createdAt: number;
}

export interface AppState {
  chats: Chat[];
  folders: Folder[];
  agents: Agent[];
  activeChat: string | null;
  activeFolder: string | null;
  darkMode: boolean;
  isStreaming: boolean;
}

export type AppAction =
  | { type: 'CREATE_FOLDER'; payload: { name: string } }
  | { type: 'DELETE_FOLDER'; payload: { id: string } }
  | { type: 'RENAME_FOLDER'; payload: { id: string; name: string } }
  | { type: 'CREATE_CHAT'; payload: { title: string; folderId?: string; agentId?: string } }
  | { type: 'DELETE_CHAT'; payload: { id: string } }
  | { type: 'RENAME_CHAT'; payload: { id: string; title: string } }
  | { type: 'MOVE_CHAT_TO_FOLDER'; payload: { chatId: string; folderId: string | null } }
  | { type: 'SET_ACTIVE_CHAT'; payload: { id: string | null } }
  | { type: 'SET_ACTIVE_FOLDER'; payload: { id: string | null } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Omit<Message, 'id' | 'timestamp'> } }
  | { type: 'SET_STREAMING'; payload: { isStreaming: boolean } }
  | { type: 'APPEND_TO_MESSAGE'; payload: { chatId: string; messageId: string; content: string } }
  | { type: 'CREATE_AGENT'; payload: Omit<Agent, 'id' | 'createdAt'> }
  | { type: 'DELETE_AGENT'; payload: { id: string } }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'ADD_FILE_TO_MESSAGE'; payload: { chatId: string; messageId: string; file: Omit<FileAttachment, 'id'> } };