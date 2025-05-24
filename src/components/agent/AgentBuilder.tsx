import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useAppContext } from '../../context/AppContext';

interface AgentBuilderProps {
  onClose: () => void;
}

const AgentBuilder: React.FC<AgentBuilderProps> = ({ onClose }) => {
  const { dispatch } = useAppContext();
  const [name, setName] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState<'gpt-3.5-turbo' | 'gpt-4'>('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);

  // Create a new agent
  const handleCreateAgent = () => {
    // Validate inputs
    if (!name.trim() || !systemPrompt.trim()) return;

    dispatch({
      type: 'CREATE_AGENT',
      payload: {
        name,
        systemPrompt,
        model,
        temperature,
      },
    });

    // Reset form and close dialog
    setName('');
    setSystemPrompt('');
    setModel('gpt-3.5-turbo');
    setTemperature(0.7);
    onClose();
  };

  return (
    <Box sx={{ pt: 1 }}>
      <TextField
        label="Agent Name"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        variant="outlined"
        placeholder="e.g., Market Analysis Expert"
      />

      <TextField
        label="System Prompt"
        fullWidth
        multiline
        rows={4}
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        margin="normal"
        variant="outlined"
        placeholder="Define the agent's behavior and expertise..."
        helperText="Instructions that define how the agent behaves and what knowledge it has"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Model</InputLabel>
        <Select
          value={model}
          label="Model"
          onChange={(e) => setModel(e.target.value as 'gpt-3.5-turbo' | 'gpt-4')}
        >
          <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
          <MenuItem value="gpt-4">GPT-4</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ mt: 3, mb: 1 }}>
        <Typography gutterBottom>Temperature: {temperature}</Typography>
        <Slider
          value={temperature}
          onChange={(_, newValue) => setTemperature(newValue as number)}
          step={0.1}
          marks
          min={0}
          max={1}
          valueLabelDisplay="auto"
        />
        <Typography variant="caption" color="text.secondary">
          Lower values (0-0.3) yield focused, deterministic responses. Higher values (0.7-1.0) yield more creative, varied responses.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateAgent}
          disabled={!name.trim() || !systemPrompt.trim()}
        >
          Create Agent
        </Button>
      </Box>
    </Box>
  );
};

export default AgentBuilder;