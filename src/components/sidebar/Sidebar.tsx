import React, { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Collapse,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ChevronDown,
  ChevronRight,
  FolderPlus,
  MessageSquarePlus,
  PlusCircle,
  MoreVertical,
  Trash2,
  Edit,
  SearchIcon,
  Palette,
  X,
  Menu as MenuIcon,
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import AgentSelector from '../agent/AgentSelector';

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isDrawerOpen, setIsDrawerOpen] = useState(!isMobile);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [folderMenuAnchor, setFolderMenuAnchor] = useState<null | HTMLElement>(null);
  const [chatMenuAnchor, setChatMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const { state, dispatch } = useAppContext();

  // Toggle folder expansion
  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Create a new chat
  const createNewChat = (folderId: string | null = null) => {
    dispatch({
      type: 'CREATE_CHAT',
      payload: {
        title: 'New Chat',
        folderId,
        agentId: null,
      },
    });
  };

  // Open folder menu
  const handleFolderMenuOpen = (event: React.MouseEvent<HTMLElement>, folderId: string) => {
    event.stopPropagation();
    setFolderMenuAnchor(event.currentTarget);
    setActiveFolderId(folderId);
  };

  // Open chat menu
  const handleChatMenuOpen = (event: React.MouseEvent<HTMLElement>, chatId: string) => {
    event.stopPropagation();
    setChatMenuAnchor(event.currentTarget);
    setActiveChatId(chatId);
  };

  // Handle folder menu actions
  const handleFolderAction = (action: 'rename' | 'delete') => {
    if (action === 'delete' && activeFolderId) {
      dispatch({
        type: 'DELETE_FOLDER',
        payload: { id: activeFolderId },
      });
    }
    // Other actions would be implemented here
    setFolderMenuAnchor(null);
    setActiveFolderId(null);
  };

  // Handle chat menu actions
  // For chat actions
const handleChatAction = (action: 'rename' | 'delete' | 'move') => {
  if (action === 'rename' && activeChatId) {
    const newTitle = window.prompt('Enter new chat title');
    if (newTitle?.trim()) {
      dispatch({
        type: 'RENAME_CHAT',
        payload: { id: activeChatId, title: newTitle.trim() },
      });
    }
  }

  if (action === 'move' && activeChatId) {
    const folderName = window.prompt('Enter target folder name');
    const folder = state.folders.find((f) => f.name === folderName?.trim());
    if (folder) {
  dispatch({
    type: 'MOVE_CHAT_TO_FOLDER',
    payload: { chatId: activeChatId, folderId: folder.id }, 
  });
}
 else {
      alert('Folder not found');
    }
  }

  if (action === 'delete' && activeChatId) {
    dispatch({
      type: 'DELETE_CHAT',
      payload: { id: activeChatId },
    });
  }

  setChatMenuAnchor(null);
  setActiveChatId(null);
};


  // Create a new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      dispatch({
        type: 'CREATE_FOLDER',
        payload: { name: newFolderName.trim() },
      });
      setNewFolderName('');
      setIsNewFolderDialogOpen(false);
    }
  };

  // Filter chats based on search query
  const filteredChats = searchQuery
    ? state.chats.filter(
        (chat) =>
          chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : state.chats;

  // Toggle dark mode
  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  // Toggle mobile drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const drawerContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: 280,
          bgcolor: 'customBackground.sidebar',
        }}
      >
        {/* Header with new chat button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            AI Chat
          </Typography>
          {isMobile && (
            <IconButton onClick={toggleDrawer} edge="end" sx={{ ml: 1 }}>
              <X size={20} />
            </IconButton>
          )}
        </Box>

        {/* New chat button */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<MessageSquarePlus size={20} />}
            onClick={() => createNewChat()}
            sx={{ py: 1 }}
          >
            New Chat
          </Button>
        </Box>

        {/* Agent selector */}
        <Box sx={{ px: 2, mb: 2 }}>
          <AgentSelector />
        </Box>

        {/* Search */}
        <Box sx={{ px: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon size={18} style={{ marginRight: 8 }} />,
              sx: { bgcolor: 'customBackground.input', borderRadius: 2 },
            }}
          />
        </Box>

        <Divider />

        {/* Folders and chats */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1, py: 1 }}>
          {/* Chats without folders */}
          {filteredChats.filter((chat) => !chat.folderId).length > 0 && (
            <List disablePadding>
              {filteredChats
                .filter((chat) => !chat.folderId)
                .map((chat) => (
                  <ListItem
                    key={chat.id}
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleChatMenuOpen(e, chat.id)}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    }
                    sx={{ mb: 0.5 }}
                  >
                    <ListItemButton
                      selected={state.activeChat === chat.id}
                      onClick={() => dispatch({ type: 'SET_ACTIVE_CHAT', payload: { id: chat.id } })}
                      sx={{
                        borderRadius: 1,
                        py: 1,
                        pr: 6, // Space for the action button
                      }}
                    >
                      <ListItemText
                        primary={chat.title}
                        primaryTypographyProps={{
                          noWrap: true,
                          fontSize: 14,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          )}

          {/* Folders */}
          <List disablePadding>
            {state.folders.map((folder) => {
              const folderChats = filteredChats.filter((chat) => chat.folderId === folder.id);
              
              // Skip empty folders when searching
              if (searchQuery && folderChats.length === 0) return null;
              
              return (
                <React.Fragment key={folder.id}>
                  <ListItem
                    disablePadding
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleFolderMenuOpen(e, folder.id)}
                      >
                        <MoreVertical size={18} />
                      </IconButton>
                    }
                    sx={{ mb: 0.5 }}
                  >
                    <ListItemButton
                      onClick={() => toggleFolder(folder.id)}
                      sx={{
                        borderRadius: 1,
                        py: 1,
                        pr: 6, // Space for the action button
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        {expandedFolders[folder.id] ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={folder.name}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          noWrap: true,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  
                  <Collapse in={expandedFolders[folder.id]} timeout="auto" unmountOnExit>
                    <List disablePadding sx={{ pl: 2 }}>
                      {folderChats.map((chat) => (
                        <ListItem
                          key={chat.id}
                          disablePadding
                          secondaryAction={
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={(e) => handleChatMenuOpen(e, chat.id)}
                            >
                              <MoreVertical size={18} />
                            </IconButton>
                          }
                          sx={{ mb: 0.5 }}
                        >
                          <ListItemButton
                            selected={state.activeChat === chat.id}
                            onClick={() => dispatch({ type: 'SET_ACTIVE_CHAT', payload: { id: chat.id } })}
                            sx={{
                              borderRadius: 1,
                              py: 1,
                              pr: 6, // Space for the action button
                            }}
                          >
                            <ListItemText
                              primary={chat.title}
                              primaryTypographyProps={{
                                noWrap: true,
                                fontSize: 14,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                      
                      {/* Add chat to folder button */}
                      <ListItem disablePadding sx={{ mt: 1 }}>
                        <ListItemButton
                          onClick={() => createNewChat(folder.id)}
                          sx={{
                            borderRadius: 1,
                            py: 0.75,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <PlusCircle size={16} />
                          </ListItemIcon>
                          <ListItemText
                            primary="New chat"
                            primaryTypographyProps={{
                              fontSize: 13,
                              color: 'text.secondary',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>

          {/* Create folder button */}
          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton
              onClick={() => setIsNewFolderDialogOpen(true)}
              sx={{
                borderRadius: 1,
                py: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FolderPlus size={18} />
              </ListItemIcon>
              <ListItemText primary="New folder" />
            </ListItemButton>
          </ListItem>
        </Box>

        {/* New folder dialog */}
        {isNewFolderDialogOpen && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'customBorder.main' }}>
            <Typography variant="subtitle2" gutterBottom>
              Create new folder
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setIsNewFolderDialogOpen(false);
                  setNewFolderName('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                Create
              </Button>
            </Box>
          </Box>
        )}

        {/* Footer with theme toggle */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'customBorder.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <IconButton onClick={toggleDarkMode} size="small" sx={{ mr: 1 }}>
            <Palette size={20} />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {state.darkMode ? 'Dark Mode' : 'Light Mode'}
          </Typography>
        </Box>
      </Box>

      {/* Folder context menu */}
      <Menu
        anchorEl={folderMenuAnchor}
        open={Boolean(folderMenuAnchor)}
        onClose={() => setFolderMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleFolderAction('rename')}>
          <Edit size={16} style={{ marginRight: 8 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={() => handleFolderAction('delete')}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Chat context menu */}
      <Menu
        anchorEl={chatMenuAnchor}
        open={Boolean(chatMenuAnchor)}
        onClose={() => setChatMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleChatAction('rename')}>
          <Edit size={16} style={{ marginRight: 8 }} />
          Rename
        </MenuItem>
        <MenuItem onClick={() => handleChatAction('move')}>
          <FolderPlus size={16} style={{ marginRight: 8 }} />
          Move to folder
        </MenuItem>
        <MenuItem onClick={() => handleChatAction('delete')}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: 1200,
            bgcolor: 'background.paper',
            boxShadow: 2,
            '&:hover': { bgcolor: 'background.paper' },
          }}
        >
          <MenuIcon size={24} />
        </IconButton>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer}
          sx={{ 
            '& .MuiDrawer-paper': { 
              width: 280,
              bgcolor: 'customBackground.sidebar',
            } 
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Box
          component="aside"
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'customBorder.main',
            bgcolor: 'customBackground.sidebar',
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {drawerContent}
        </Box>
      )}
    </>
  );
};

export default Sidebar;