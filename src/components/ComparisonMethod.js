import { Button, Box, Typography } from '@mui/material';

export default function ComparisonMethod({ setComparisonMethod, nextStep, prevStep }) {
  const handleMethodSelect = (method) => {
    setComparisonMethod(method);
    nextStep();
  };

  return (
    <Box className="space-y-8 h-[80vh] flex flex-col justify-center items-center">
      <Typography variant="h2">How to compare</Typography>
      <Button fullWidth variant="outlined" onClick={() => handleMethodSelect('core-values')}>
        Based on Core values
      </Button>
      <Button fullWidth variant="outlined" onClick={() => handleMethodSelect('weighted-criteria')}>
        Based on weighted Criteria
      </Button>
      <Button fullWidth variant="outlined" onClick={() => handleMethodSelect('pro-cons')}>
        Based on pro/cons comparison
      </Button>
      <Box className="flex justify-between">
        <Button color="secondary" onClick={prevStep}>Back</Button>
      </Box>
    </Box>
  );
}