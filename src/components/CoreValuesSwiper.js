import { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useSwipeable } from 'react-swipeable';

export default function CoreValuesSwiper({ issue, options, selectedCoreValues, prevStep, nextStep }) {
  const [currentOption, setCurrentOption] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const initialScores = options.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {});
    setScores(initialScores);
  }, [options]);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      setScores(prev => ({
        ...prev,
        [options[currentOption]]: prev[options[currentOption]] + 1
      }));
    }

    if (currentValue < (selectedCoreValues?.length ?? 0) - 1) {
      setCurrentValue(currentValue + 1);
    } else if (currentOption < options.length - 1) {
      setCurrentOption(currentOption + 1);
      setCurrentValue(0);
    } else {
      // All options and values have been swiped
      localStorage.setItem('scores', JSON.stringify(scores));
      nextStep(); // Move to results screen
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

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
      <Card {...handlers}>
        <CardContent>
          <Typography variant="h5">{coreValue.value}</Typography>
          <Typography variant="body2">{coreValue.description}</Typography>
        </CardContent>
      </Card>
    );
  };

  if (!selectedCoreValues || selectedCoreValues.length === 0) {
    return (
      <Box className="space-y-4">
        <Typography>No core values selected. Please go back and select some core values.</Typography>
        <Button onClick={prevStep}>Back</Button>
      </Box>
    );
  }

  if (!options || options.length === 0) {
    return (
      <Box className="space-y-4">
        <Typography>No options available</Typography>
        <Button onClick={prevStep}>Back</Button>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      <Typography variant="h2">{issue}</Typography>
      <Typography variant="h3">{options[currentOption]}</Typography>
      {renderCard()}
      <Box className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
        <Typography>Swipe right if this core value applies, left if it doesn't</Typography>
      </Box>
    </Box>
  );
}