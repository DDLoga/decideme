import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, CardActionArea, Dialog, DialogTitle, DialogContent, DialogActions, TextField, useTheme } from '@mui/material';


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
  const theme = useTheme();
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
            <Typography 
        variant="h2" 
        className="sticky top-0 bg-black z-10 py-4 mb-4"
        sx={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
      >
        Select Core Values
      </Typography>
      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coreValues.map((cv, index) => (
          <Card 
            key={index} 
            raised={selectedValues.includes(cv.value)}
            sx={{
              transition: 'all 0.3s',
              backgroundColor: selectedValues.includes(cv.value) 
                ? `${theme.palette.primary.main}80` // 20 is for 12.5% opacity
                : 'inherit',
              '&:hover': {
                backgroundColor: selectedValues.includes(cv.value) 
                  ? `${theme.palette.primary.main}30` // 30 is for 18.75% opacity
                  : theme.palette.action.hover,
              },
            }}
          >
            <CardActionArea onClick={() => handleValueSelect(cv.value)}>
              <CardContent>
                <Typography variant="h5" component="div" className="font-bold mb-2">
                  {cv.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cv.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Button color="secondary" onClick={() => setNewValueDialog(true)}>Add Core Value</Button>
      <Box className="flex justify-between">
        <Button color="secondary" onClick={prevStep}>Back</Button>
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