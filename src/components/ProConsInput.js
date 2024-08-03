import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

export default function ProConsInput({ issue, options, prevStep, nextStep }) {
  const [currentOption, setCurrentOption] = useState(0);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [pros, setPros] = useState({});
  const [cons, setCons] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const initialProsConsState = options.reduce((acc, option) => {
      acc[option] = [];
      return acc;
    }, {});
    setPros(initialProsConsState);
    setCons(initialProsConsState);
  }, [options]);

  const addPro = () => {
    if (newPro.trim()) {
      setPros(prev => ({
        ...prev,
        [options[currentOption]]: [...prev[options[currentOption]], newPro.trim()]
      }));
      setNewPro('');
    }
  };

  const addCon = () => {
    if (newCon.trim()) {
      setCons(prev => ({
        ...prev,
        [options[currentOption]]: [...prev[options[currentOption]], newCon.trim()]
      }));
      setNewCon('');
    }
  };

  const handleNext = () => {
    if (!pros[options[currentOption]] || !cons[options[currentOption]] ||
        pros[options[currentOption]].length === 0 || cons[options[currentOption]].length === 0) {
      alert('Please enter at least one pro and one con for this option.');
      return;
    }
  
    if (currentOption < options.length - 1) {
      setCurrentOption(currentOption + 1);
    } else {
      nextStep({ pros, cons });
    }
  };

  const handleDeletePro = (indexToDelete) => {
    setPros(prev => ({
      ...prev,
      [options[currentOption]]: prev[options[currentOption]].filter((_, index) => index !== indexToDelete)
    }));
  };

  const handleDeleteCon = (indexToDelete) => {
    setCons(prev => ({
      ...prev,
      [options[currentOption]]: prev[options[currentOption]].filter((_, index) => index !== indexToDelete)
    }));
  };

  return (
    <Box className="flex flex-col justify-start space-y-8 items-center p-4">
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Typography variant={isMobile ? "body1" : "h4"} component="span">
          addressing{' '}
          <Typography
            variant={isMobile ? "h3" : "h2"}
            component="span"
            color="primary"
          >
            {issue}
          </Typography>
        </Typography>
        <Typography variant={isMobile ? "body1" : "h4"} component="span">
          with{' '}
          <Typography
            variant={isMobile ? "h1" : "h1"}
            component="span"
            color="secondary"
          >
            {options[currentOption]}
          </Typography>
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 400, display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            label="Add a pro"
            value={newPro}
            onChange={(e) => setNewPro(e.target.value)}
            fullWidth
          />
          <Button variant="outlined" onClick={addPro} startIcon={<AddIcon />}>Add</Button>
        </Box>
        
        <Box sx={{ width: '100%', maxWidth: 400, display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            label="Add a con"
            value={newCon}
            onChange={(e) => setNewCon(e.target.value)}
            fullWidth
          />
          <Button color='secondary' variant="outlined" onClick={addCon} startIcon={<AddIcon />}>Add</Button>
        </Box>
      </Box>
      
      <Box sx={{ width: '100%', maxWidth: 400, height: 'auto', overflow: 'auto' }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>Pros:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {pros[options[currentOption]]?.map((pro, index) => (
            <Chip
              key={`pro-${index}`}
              label={pro}
              onDelete={() => handleDeletePro(index)}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
        
        <Typography variant="subtitle1" color="secondary" gutterBottom>Cons:</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {cons[options[currentOption]]?.map((con, index) => (
            <Chip
              key={`con-${index}`}
              label={con}
              onDelete={() => handleDeleteCon(index)}
              color="secondary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Box>
      
      <Box className="flex items-center space-x-8 w-full mt-4" sx={{ maxWidth: 400 }}>
        <Button onClick={prevStep} variant="outlined">Back</Button>
        <Button variant="contained" onClick={handleNext}>
          {currentOption === options.length - 1 ? 'Finish' : 'Next Option'}
        </Button>
      </Box>
    </Box>
  );
}