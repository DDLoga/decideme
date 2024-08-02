import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Slider, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const weightMarks = [
  { value: 1, label: 'Is a plus' },
  { value: 2, label: 'Important' },
  { value: 3, label: 'Very important' },
  { value: 4, label: 'Critical' },
];

export default function WeightedCriteriaInput({ nextStep, prevStep }) {
  const [criteria, setCriteria] = useState([]);
  const [newCriterion, setNewCriterion] = useState('');
  const [newWeight, setNewWeight] = useState(2);

  useEffect(() => {
    const storedCriteria = localStorage.getItem('weightedCriteria');
    if (storedCriteria) {
      setCriteria(JSON.parse(storedCriteria));
    }
  }, []);

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      const updatedCriteria = [...criteria, { name: newCriterion, weight: newWeight }];
      setCriteria(updatedCriteria);
      setNewCriterion('');
      setNewWeight(2);
      localStorage.setItem('weightedCriteria', JSON.stringify(updatedCriteria));
    }
  };

  const handleDeleteCriterion = (index) => {
    const updatedCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(updatedCriteria);
    localStorage.setItem('weightedCriteria', JSON.stringify(updatedCriteria));
  };

  const handleNext = () => {
    if (criteria.length > 0) {
      nextStep();
    }
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h2">Define Weighted Criteria</Typography>
      <TextField
        fullWidth
        label="Criterion"
        value={newCriterion}
        onChange={(e) => setNewCriterion(e.target.value)}
      />
      <Typography gutterBottom>Weight</Typography>
      <Slider
        value={newWeight}
        onChange={(_, value) => setNewWeight(value)}
        step={1}
        marks={weightMarks}
        min={1}
        max={4}
        valueLabelDisplay="auto"
      />
      <Button variant="contained" onClick={handleAddCriterion}>Add Criterion</Button>
      <List>
        {criteria.map((criterion, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCriterion(index)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText 
              primary={criterion.name} 
              secondary={`Weight: ${weightMarks.find(mark => mark.value === criterion.weight).label}`} 
            />
          </ListItem>
        ))}
      </List>
      <Box className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" onClick={handleNext} disabled={criteria.length === 0}>Next</Button>
      </Box>
    </Box>
  );
}