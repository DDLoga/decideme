import { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

export default function ProConsInput({ issue, options, nextStep, prevStep }) {
  const [currentOption, setCurrentOption] = useState(0);
  const [pros, setPros] = useState(Array(options.length).fill([]));
  const [cons, setCons] = useState(Array(options.length).fill([]));
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  const addPro = () => {
    if (newPro.trim()) {
      const updatedPros = [...pros];
      updatedPros[currentOption] = [...updatedPros[currentOption], newPro.trim()];
      setPros(updatedPros);
      setNewPro('');
    }
  };

  const addCon = () => {
    if (newCon.trim()) {
      const updatedCons = [...cons];
      updatedCons[currentOption] = [...updatedCons[currentOption], newCon.trim()];
      setCons(updatedCons);
      setNewCon('');
    }
  };

  const handleNext = () => {
    if (pros[currentOption].length === 0 || cons[currentOption].length === 0) {
      alert('Please enter at least one pro and one con for this option.');
      return;
    }

    if (currentOption < options.length - 1) {
      setCurrentOption(currentOption + 1);
    } else {
      nextStep({ pros, cons });
    }
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h2">{issue}</Typography>
      <Typography variant="h3">{options[currentOption]}</Typography>
      
      <TextField
        fullWidth
        label="Add a pro"
        value={newPro}
        onChange={(e) => setNewPro(e.target.value)}
      />
      <Button onClick={addPro}>Add Pro</Button>
      
      <TextField
        fullWidth
        label="Add a con"
        value={newCon}
        onChange={(e) => setNewCon(e.target.value)}
      />
      <Button onClick={addCon}>Add Con</Button>
      
      <List>
        <Typography variant="h6">Pros:</Typography>
        {pros[currentOption].map((pro, index) => (
          <ListItem key={`pro-${index}`}>
            <ListItemText primary={pro} />
          </ListItem>
        ))}
      </List>
      
      <List>
        <Typography variant="h6">Cons:</Typography>
        {cons[currentOption].map((con, index) => (
          <ListItem key={`con-${index}`}>
            <ListItemText primary={con} />
          </ListItem>
        ))}
      </List>
      
      <Box className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" onClick={handleNext}>
          {currentOption === options.length - 1 ? 'Finish' : 'Next Option'}
        </Button>
      </Box>
    </Box>
  );
}