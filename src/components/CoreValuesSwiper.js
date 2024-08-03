import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

export default function CoreValuesSwiper({ issue, options, selectedCoreValues, prevStep, nextStep }) {
  const [currentOption, setCurrentOption] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [scores, setScores] = useState({});
  const [direction, setDirection] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const initialScores = options.reduce((acc, option) => {
      acc[option] = selectedCoreValues.reduce((valueAcc, coreValue) => {
        valueAcc[coreValue.value] = 0;
        return valueAcc;
      }, {});
      return acc;
    }, {});
    setScores(initialScores);
  }, [options, selectedCoreValues]);

  const handleDragEnd = (event, info) => {
    const threshold = 100; // Distance from center to count as a choice
    if (info.offset.x < -threshold) {
      handleChoice('left');
    } else if (info.offset.x > threshold) {
      handleChoice('right');
    }
  };

  const handleChoice = (chosenDirection) => {
    setDirection(chosenDirection);
    const currentCoreValue = selectedCoreValues[currentValue].value;
    setScores(prev => ({
      ...prev,
      [options[currentOption]]: {
        ...prev[options[currentOption]],
        [currentCoreValue]: chosenDirection === 'right' ? 1 : 0
      }
    }));

    setTimeout(() => {
      if (currentValue < selectedCoreValues.length - 1) {
        setCurrentValue(currentValue + 1);
      } else if (currentOption < options.length - 1) {
        setCurrentOption(currentOption + 1);
        setCurrentValue(0);
      } else {
        // All options and values have been evaluated
        const finalScores = calculateFinalScores();
        console.log('CoreValuesComparison finalScores:', finalScores);
        localStorage.setItem('currentScores', JSON.stringify(finalScores));
        nextStep(finalScores);
      }
      setDirection(null);
    }, 300); // Wait for exit animation to complete
  };

  const calculateFinalScores = () => {
    return Object.entries(scores).reduce((acc, [option, coreValueScores]) => {
      acc[option] = Object.values(coreValueScores).reduce((sum, score) => sum + score, 0);
      return acc;
    }, {});
  };

  const renderCard = () => {
    if (!selectedCoreValues || selectedCoreValues.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography>No core values selected. Please go back and select some core values.</Typography>
          </CardContent>
        </Card>
      );
    }

    const coreValue = selectedCoreValues[currentValue];
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentOption}-${currentValue}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={
            direction === 'left'
              ? { opacity: 0, x: -300, transition: { duration: 0.3 } }
              : direction === 'right'
              ? { opacity: 0, x: 300, transition: { duration: 0.3 } }
              : { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
          }
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <Card sx={{ 
            width: isMobile ? '90vw' : 300, 
            height: isMobile ? 'auto' : 'auto',
            maxWidth: 400,
          }}>
            <CardContent>
              <Typography color='primary' variant={isMobile ? "h4" : "h3"} gutterBottom>{coreValue.value}</Typography>
              <Typography variant="body2">{coreValue.description}</Typography>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

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
        <Typography textAlign="center">
          is a proof of
        </Typography>
      </Box>
      <Box sx={{ 
        position: 'relative', 
        width: isMobile ? '90vw' : 300, 
        height: isMobile ? 'auto' : 'auto',
        maxWidth: 400,
        margin: '20px 0'
      }}>
        {renderCard()}
      </Box>
      <Box className="flex flex-col items-center space-y-4">
        <Typography textAlign="center">
          Drag right if this core value applies, left if it doesn't
        </Typography>
        <Button onClick={prevStep} variant="outlined">Back</Button>
      </Box>
    </Box>
  );
}