import { useState, useEffect } from 'react';
import { Chip, Box, Typography, TextField, Button, Slider, List, ListItem, ListItemText, IconButton } from '@mui/material';
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
    <Box className="space-y-8 flex flex-col">
      <Typography variant="h3">Define Weighted Criteria</Typography>
      <TextField
        fullWidth
        label="Criterion"
        value={newCriterion}
        onChange={(e) => setNewCriterion(e.target.value)}
      />
      <div className='flex flex-col items-center'>
      <Slider
        className='w-[90%]'
        value={newWeight}
        onChange={(_, value) => setNewWeight(value)}
        step={1}
        marks={weightMarks}
        min={1}
        max={4}
        valueLabelDisplay="auto"
      />
      </div>
      <Button className='mt-4' variant="contained" onClick={handleAddCriterion}>Add Criterion</Button>
      <Box className="flex flex-wrap gap-2">
        {criteria.map((criterion, index) => (
          <Chip
            key={index}
            label={
              <Box>
                <Typography variant="body2">{criterion.name}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {weightMarks.find(mark => mark.value === criterion.weight).label}
                </Typography>
              </Box>
            }
            onDelete={() => handleDeleteCriterion(index)}
            deleteIcon={<DeleteIcon />}
            color="primary"
            variant="outlined"
            sx={{
              height: 'auto',
              '& .MuiChip-label': {
                display: 'block',
                whiteSpace: 'normal',
                padding: '10px',
              },
              '& .MuiChip-deleteIcon': {
                margin: '0 5px',
              },
            }}
          />
        ))}
      </Box>
      <Box className="flex justify-between">
        <Button color='secondary' onClick={prevStep}>Back</Button>
        <Button variant="contained" onClick={handleNext} disabled={criteria.length === 0}>Next</Button>
      </Box>
    </Box>
  );
}