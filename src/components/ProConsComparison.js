import { useState, useEffect } from 'react';
import { Box, Typography, Button, Slider } from '@mui/material';

const comparisonMarks = [
  { value: -2, label: 'Much worse' },
  { value: -1, label: 'Slightly worse' },
  { value: 0, label: 'Same' },
  { value: 1, label: 'Better' },
  { value: 2, label: 'Much better' },
];

export default function ProConsComparison({ issue, options, pros, cons, nextStep, prevStep }) {
  const [comparisons, setComparisons] = useState([]);
  const [currentComparison, setCurrentComparison] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const allComparisons = [];
    for (let i = 0; i < options.length; i++) {
      for (let j = i + 1; j < options.length; j++) {
        pros[i].forEach(pro1 => {
          pros[j].forEach(pro2 => {
            allComparisons.push({ type: 'pro', option1: i, reason1: pro1, option2: j, reason2: pro2 });
          });
        });
        cons[i].forEach(con1 => {
          cons[j].forEach(con2 => {
            allComparisons.push({ type: 'con', option1: i, reason1: con1, option2: j, reason2: con2 });
          });
        });
      }
    }
    setComparisons(allComparisons);
  }, [options, pros, cons]);

  const handleScoreChange = (_, value) => {
    console.log('value', value);
    setCurrentScore(value);
  };

  useEffect(() => {
    console.log('comparisons', comparisons);
  }, [comparisons]);

  const handleNext = () => {
    const updatedComparisons = [...comparisons];
    updatedComparisons[currentComparison].score = currentScore;
    setComparisons(updatedComparisons);
  
    if (currentComparison < comparisons.length - 1) {
      setCurrentComparison(currentComparison + 1);
      setCurrentScore(0);
    } else {
      const finalScores = calculateFinalScores();
      console.log('finalScores', finalScores);
      localStorage.setItem('proConsScores', JSON.stringify(finalScores));
      nextStep(finalScores);
    }
  };

  const calculateFinalScores = () => {
    const scores = {};
    options.forEach((option, index) => {
      scores[option] = 0;
    });
    comparisons.forEach(comparison => {
      scores[options[comparison.option1]] += comparison.score;
      scores[options[comparison.option2]] -= comparison.score;
    });
    return scores;
  };

  if (comparisons.length === 0) {
    return <Typography>Loading comparisons...</Typography>;
  }

  const currentComp = comparisons[currentComparison];

  return (
    <Box className="space-y-4">
      <Typography variant="h2">{issue}</Typography>
      <Typography>{options[currentComp.option1]}: {currentComp.reason1}</Typography>
      <Typography>is</Typography>
      <Slider
        marks={comparisonMarks}
        min={-2}
        max={2}
        step={1}
        value={currentScore}
        onChange={handleScoreChange}
        valueLabelDisplay="auto"
      />
      <Typography>than</Typography>
      <Typography>{options[currentComp.option2]}: {currentComp.reason2}</Typography>
      
      <Box className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
        <Button variant="contained" onClick={handleNext}>
          {currentComparison === comparisons.length - 1 ? 'Finish' : 'Next Comparison'}
        </Button>
      </Box>
    </Box>
  );
}