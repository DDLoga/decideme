import { useState, useEffect } from 'react';
import { Box, Typography, Button, Slider } from '@mui/material';

const impactMarks = [
  { value: 1, label: 'Quite bad' },
  { value: 2, label: 'Slightly bad' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Slightly good' },
  { value: 5, label: 'Greatly' },
];

export default function WeightedCriteriaComparison({ issue, options, prevStep, nextStep }) {
    const [criteria, setCriteria] = useState([]);
    const [currentOption, setCurrentOption] = useState(0);
    const [currentCriterion, setCurrentCriterion] = useState(0);
    const [scores, setScores] = useState({});
    const [currentScore, setCurrentScore] = useState(3); // Default to 'Neutral'
  
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
      <Box className="space-y-4">
        <Typography variant="h2">{issue}</Typography>
        <Typography variant="h3">{options[currentOption]}</Typography>
        <Typography>How does this option impact: {criteria[currentCriterion].name}?</Typography>
        <Slider
          marks={impactMarks}
          min={1}
          max={5}
          step={1}
          value={currentScore}
          valueLabelDisplay="auto"
          onChange={handleImpactChange}
        />
        <Box className="flex justify-between">
          <Button onClick={prevStep}>Back</Button>
          <Button variant="contained" onClick={handleNext}>
            {currentOption === options.length - 1 && currentCriterion === criteria.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    );
  }