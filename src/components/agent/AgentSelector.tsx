import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { PlusCircle, Bot } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import AgentBuilder from './AgentBuilder';

const AgentSelector: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [isAgentBuilderOpen, setIsAgentBuilderOpen] = useState(false);

  // Handle agent selection
  const handleAgentChange = (event: SelectChangeEvent) => {
    const agentId = event.target.value;
    setSelectedAgentId(agentId);
    
    // If we have an active chat, assign the agent to it
    if (state.activeChat) {
      dispatch({
        type: 'SET_ACTIVE_AGENT',
        payload: { chatId: state.activeChat, agentId },
      });
    }
  };

  // Open agent builder modal
  const handleOpenAgentBuilder = () => {
    setIsAgentBuilderOpen(true);
  };

  // Close agent builder modal
  const handleCloseAgentBuilder = () => {
    setIsAgentBuilderOpen(false);
  };

  return (
    <>
      <FormControl fullWidth size="small">
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'customBackground.input',
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexGrow: 1,
            }}
          >
            <Bot size={18} style={{ marginRight: 8, opacity: 0.7 }} />
            <Select
              value={selectedAgentId}
              onChange={handleAgentChange}
              displayEmpty
              variant="standard"
              disableUnderline
              sx={{ 
                flexGrow: 1,
                '& .MuiSelect-select': {
                  py: 0.5,
                  fontSize: '0.875rem',
                },
              }}
            >
              <MenuItem value="">
                <em>Default Assistant</em>
              </MenuItem>
              {state.agents.map((agent) => (
                <MenuItem key={agent.id} value={agent.id}>
                  {agent.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <IconButton size="small" onClick={handleOpenAgentBuilder}>
            <PlusCircle size={18} />
          </IconButton>
        </Box>
      </FormControl>

      {/* Agent Builder Dialog */}
      <Dialog
        open={isAgentBuilderOpen}
        onClose={handleCloseAgentBuilder}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Agent</DialogTitle>
        <DialogContent>
          <AgentBuilder onClose={handleCloseAgentBuilder} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentSelector;