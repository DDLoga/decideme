import { useState, useEffect } from 'react';
import React from 'react';
import { Box, Typography, Button, Slider, useTheme, useMediaQuery } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutralOutlined';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfiedOutlined';

const comparisonMarks = [
  { value: -2, label: 'Much worse', icon: <SentimentVeryDissatisfiedIcon /> },
  { value: -1, label: 'Worse', icon: <SentimentDissatisfiedIcon /> },
  { value: 0, label: 'Same', icon: <SentimentNeutralIcon /> },
  { value: 1, label: 'Better', icon: <SentimentSatisfiedIcon /> },
  { value: 2, label: 'Much better', icon: <SentimentVerySatisfiedIcon /> },
];

export default function ProConsComparison({ issue, options, pros, cons, nextStep, prevStep }) {
  const [comparisons, setComparisons] = useState([]);
  const [currentComparison, setCurrentComparison] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const allComparisons = [];
    for (let i = 0; i < options.length; i++) {
      for (let j = i + 1; j < options.length; j++) {
        (pros[options[i]] || []).forEach(pro1 => {
          (pros[options[j]] || []).forEach(pro2 => {
            allComparisons.push({ type: 'pro', option1: i, reason1: pro1, option2: j, reason2: pro2 });
          });
        });
        (cons[options[i]] || []).forEach(con1 => {
          (cons[options[j]] || []).forEach(con2 => {
            allComparisons.push({ type: 'con', option1: i, reason1: con1, option2: j, reason2: con2 });
          });
        });
      }
    }
    setComparisons(allComparisons);
  }, [options, pros, cons]);

  const handleScoreChange = (_, value) => {
    setCurrentScore(value);
  };

  const handleNext = () => {
    const updatedComparisons = [...comparisons];
    updatedComparisons[currentComparison].score = currentScore;
    setComparisons(updatedComparisons);

    if (currentComparison < comparisons.length - 1) {
      setCurrentComparison(currentComparison + 1);
      setCurrentScore(0);
    } else {
      const finalScores = calculateFinalScores();
      console.log('ProConsComparison finalScores:', finalScores);
      localStorage.setItem('currentScores', JSON.stringify(finalScores));
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
    <Box className="space-y-8 md:space-y-8 flex flex-col h-[80vh] justify-center items-center p-4">
      <Box textAlign="center">
        <Typography variant="h6" component="span">
          addressing{' '}
        </Typography>
        <Typography variant="h2" component="span" color="primary">
          {issue}
        </Typography>
      </Box>
      <Box textAlign="center">
        <Typography variant="h6" component="span">
          comparing{' '}
        </Typography>
        {/* <Typography variant="h3" component="span" color="secondary">
          {options[currentComp.option1]}
        </Typography> */}
        <Typography variant="h3" color='primary' component="span">
          {currentComp.reason1}
        </Typography>
      </Box>
      {/* <Box textAlign="center" sx={{ maxWidth: 400 }}>

      </Box> */}
      <Typography variant="body1">is</Typography>
      <Box sx={{
        width: 300,
        maxWidth: 400,
        margin: '20px 0'
      }}>
        <Slider
          marks={comparisonMarks}
          min={-2}
          max={2}
          step={1}
          value={currentScore}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => comparisonMarks.find(mark => mark.value === value).label}
          onChange={handleScoreChange}
        />
      </Box>

      {/* <Box textAlign="center">
        <Typography variant="h3" component="span" color="secondary">
          {options[currentComp.option2]}
        </Typography>
      </Box> */}
      <Box textAlign="center" sx={{ maxWidth: 400 }}>
        <Typography variant="body1">than</Typography>
        <Typography variant="h3" color='secondary' component="span">
          {currentComp.reason2}
        </Typography>
      </Box>
      <Box className="flex flex-col items-center space-y-4">
        <Typography textAlign="center" variant="body2">
          Slide to indicate the comparison
        </Typography>
        <Box className="flex justify-between w-full">
          <Button onClick={prevStep} variant="outlined">Back</Button>
          <Button variant="contained" onClick={handleNext}>
            {currentComparison === comparisons.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}