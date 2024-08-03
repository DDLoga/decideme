import { useState } from 'react';
import { Chip, Typography, TextField, Button, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
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
      <Typography variant="h1" className="mb-4">What are your options?</Typography>
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
      <Box className="flex flex-wrap space-x-2">
        {options.map((option, index) => (
          <Chip 
            key={index} 
            label={option} 
            onDelete={() => removeOption(index)} 
            color="primary" 
            size="large" 
          />
        ))}
      </Box>
      <Box className="flex justify-between">
        <Button color="secondary" onClick={prevStep}>Back</Button>
        <Button type="submit" variant="contained" disabled={options.length < 2}>
          Next
        </Button>
      </Box>
      <Button color="secondary" onClick={() => { setOptions([]); prevStep(); }}>
        Reset
      </Button>
    </Box>
  );
}