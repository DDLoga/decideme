import React from 'react'; 
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Slider, useTheme, useMediaQuery } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

const impactMarks = [
  { value: 1, label: 'Quite bad', icon: <SentimentVeryDissatisfiedIcon /> },
  { value: 2, label: 'Slightly bad', icon: <SentimentDissatisfiedIcon /> },
  { value: 3, label: 'Neutral', icon: <SentimentNeutralIcon /> },
  { value: 4, label: 'Slightly good', icon: <SentimentSatisfiedIcon /> },
  { value: 5, label: 'Greatly', icon: <SentimentVerySatisfiedIcon /> },
];

export default function WeightedCriteriaComparison({ issue, options, prevStep, nextStep }) {
  const [criteria, setCriteria] = useState([]);
  const [currentOption, setCurrentOption] = useState(0);
  const [currentCriterion, setCurrentCriterion] = useState(0);
  const [scores, setScores] = useState({});
  const [currentScore, setCurrentScore] = useState(3); // Default to 'Neutral'
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    const storedCriteria = localStorage.getItem('weightedCriteria');
    if (storedCriteria) {
      setCriteria(JSON.parse(storedCriteria));
    }
  }, []);

  useEffect(() => {
    const initialScores = options.reduce((acc, option) => {
      acc[option] = criteria.reduce((criteriaAcc, criterion) => {
        criteriaAcc[criterion.name] = 3; // Default to 'Neutral'
        return criteriaAcc;
      }, {});
      return acc;
    }, {});
    setScores(initialScores);
  }, [options, criteria]);

  const handleImpactChange = (_, value) => {
    setCurrentScore(value);
  };

  const handleNext = () => {
    const updatedScores = { ...scores };
    updatedScores[options[currentOption]][criteria[currentCriterion].name] = currentScore;
    setScores(updatedScores);

    if (currentCriterion < criteria.length - 1) {
      setCurrentCriterion(currentCriterion + 1);
    } else if (currentOption < options.length - 1) {
      setCurrentOption(currentOption + 1);
      setCurrentCriterion(0);
    } else {
      // All options and criteria have been evaluated
      const finalScores = calculateFinalScores(updatedScores);
      localStorage.setItem('weightedCriteriaScores', JSON.stringify(finalScores));
      nextStep(finalScores);
    }
    setCurrentScore(3); // Reset to 'Neutral' for the next evaluation
  };

  const calculateFinalScores = (scores) => {
    return Object.entries(scores).reduce((acc, [option, criteriaScores]) => {
      acc[option] = Object.entries(criteriaScores).reduce((sum, [criterionName, score]) => {
        const criterion = criteria.find(c => c.name === criterionName);
        return sum + (score * criterion.weight);
      }, 0);
      return acc;
    }, {});
  };

  if (criteria.length === 0 || options.length === 0) {
    return (
      <Box className="space-y-4">
        <Typography>No criteria or options available</Typography>
        <Button onClick={prevStep}>Back</Button>
      </Box>
    );
  }

  return (
    <Box className="space-y-8 md:space-y-8 flex flex-col h-[80vh] justify-center items-center p-4">
      <Box textAlign="center">
        <Typography variant={isMobile ? "h6" : "h5"} component="span">
          addressing{' '}
        </Typography>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          component="span"
          color="primary"
        >
          {issue}
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant={isMobile ? "h6" : "h5"} component="span">
          with{' '}
        </Typography>
        <Typography
          variant={isMobile ? "h3" : "h1"}
          component="span"
          color="secondary"
        >
          {options[currentOption]}
        </Typography>
      </Box>
      <Box textAlign="center" sx={{ maxWidth: isMobile ? '90vw' : 400 }}>
        <Typography variant={isMobile ? "body1" : "h6"} component="span">
          How
        </Typography>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="span"
          className='ml-2 mr-2'
          color="primary"
          gutterBottom
        >
          {criteria[currentCriterion].name}
        </Typography>
        <Typography component="span" variant={isMobile ? "body1" : "h6"}>
          is this option?
        </Typography>
      </Box>
      <Box sx={{
        width: isMobile ? '90vw' : 300,
        maxWidth: 400,
        margin: '20px 0'
      }}>
        <Slider
          marks={impactMarks.map(mark => ({
            value: mark.value,
            label: (
              <Box sx={{ transform: 'scale(1.5)', mt: 1 }}>
                {React.cloneElement(mark.icon, { sx: { fontSize: '1.75rem' } })}
              </Box>
            )
          }))}
          min={1}
          max={5}
          step={1}
          value={currentScore}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => impactMarks.find(mark => mark.value === value).label}
          onChange={handleImpactChange}
        />
      </Box>
      {/* <Box className="flex justify-between w-full">
        {impactMarks.map((mark) => (
          <Box key={mark.value} className="flex flex-col items-center">
            {mark.icon}
            <Typography variant="caption">{mark.label}</Typography>
          </Box>
        ))}
      </Box> */}
      <Box className="flex flex-col items-center space-y-4">
        <Typography textAlign="center" variant="body2">
          Slide to indicate the impact
        </Typography>
        <Box className="flex justify-between w-full">
          <Button onClick={prevStep} variant="outlined">Back</Button>
          <Button variant="contained" onClick={handleNext}>
            {currentOption === options.length - 1 && currentCriterion === criteria.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}