import { useState, useEffect } from 'react';
import { Box, Typography, Button, Checkbox, FormControlLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const defaultCoreValues = [
  { value: 'Self motivation', description: 'Taking action based on my own will rather than pleasing others' },
  { value: 'Leadership', description: 'Leading by example' },
  { value: 'Pragmatism', description: 'Fairness over moral, necessity over reasonability' },
  { value: 'Trust & responsibility', description: 'Honoring my mentors and those believing in me' },
  { value: 'Challenge', description: 'Challenge my status quo, getting out of my comfort zone' },
  { value: 'Efficiency', description: 'Using my time and energy wisely to achieve my goals' },
  { value: 'Altruism', description: 'Helping others' },
];

export default function CoreValuesSelection({ issue, options, prevStep, nextStep }) {
  const [coreValues, setCoreValues] = useState(defaultCoreValues);
  const [selectedValues, setSelectedValues] = useState([]);
  const [newValueDialog, setNewValueDialog] = useState(false);
  const [newValue, setNewValue] = useState({ value: '', description: '' });

  useEffect(() => {
    const storedValues = localStorage.getItem('coreValues');
    if (storedValues) {
      setCoreValues(JSON.parse(storedValues));
    }
  }, []);

  const handleValueSelect = (value) => {
    setSelectedValues(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleAddValue = () => {
    setCoreValues([...coreValues, newValue]);
    setNewValue({ value: '', description: '' });
    setNewValueDialog(false);
    localStorage.setItem('coreValues', JSON.stringify([...coreValues, newValue]));
  };

  const handleNext = () => {
    const selectedCoreValues = coreValues.filter(cv => selectedValues.includes(cv.value));
    localStorage.setItem('selectedCoreValues', JSON.stringify(selectedCoreValues));
    nextStep(selectedCoreValues);
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h2">Select Core Values</Typography>
      {coreValues.map((cv, index) => (
        <FormControlLabel
          key={index}
          control={<Checkbox checked={selectedValues.includes(cv.value)} onChange={() => handleValueSelect(cv.value)} />}
          label={`${cv.value}: ${cv.description}`}
        />
      ))}
      <Button onClick={() => setNewValueDialog(true)}>Add Core Value</Button>
      <Box className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" disabled={selectedValues.length === 0} onClick={handleNext}>Next</Button>
      </Box>

      <Dialog open={newValueDialog} onClose={() => setNewValueDialog(false)}>
        <DialogTitle>Add New Core Value</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Core Value"
            fullWidth
            value={newValue.value}
            onChange={(e) => setNewValue({ ...newValue, value: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={newValue.description}
            onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewValueDialog(false)}>Cancel</Button>
          <Button onClick={handleAddValue}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}