import { useState } from 'react';
import { TextField, Button, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function OptionsInput({ options, setOptions, nextStep, prevStep }) {
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newOption.trim()) {
      addOption();
    }
    if (options.length >= 2) {
      nextStep();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="space-y-4">
      <TextField
        fullWidth
        label="Enter an option"
        value={newOption}
        onChange={(e) => setNewOption(e.target.value)}
        helperText="Enter at least 2 options to be compared"
      />
      <Button onClick={addOption} disabled={!newOption.trim()}>
        Add Option
      </Button>
      <List>
        {options.map((option, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => removeOption(index)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={option} />
          </ListItem>
        ))}
      </List>
      <Box className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
        <Button type="submit" variant="contained" disabled={options.length < 2}>
          Next
        </Button>
      </Box>
      <Button onClick={() => { setOptions([]); prevStep(); }}>
        Reset
      </Button>
    </Box>
  );
}