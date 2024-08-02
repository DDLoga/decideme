import { Button, Box, Typography } from '@mui/material';

export default function ComparisonMethod({ setComparisonMethod, nextStep, prevStep }) {
  const handleMethodSelect = (method) => {
    setComparisonMethod(method);
    nextStep();
  };

  return (
    <Box className="space-y-4">
      <Typography variant="h2">How to compare</Typography>
      <Button fullWidth variant="outlined" onClick={() => handleMethodSelect('core-values')}>
        Based on Core values
      </Button>
      <Button fullWidth variant="outlined" onClick={() => handleMethodSelect('weighted-criteria')}>
        Based on weighted Criteria
      </Button>
      <Button fullWidth variant="outlined" disabled>
        Based on pro/cons comparison (Coming soon)
      </Button>
      <Box className="flex justify-between">
        <Button onClick={prevStep}>Back</Button>
      </Box>
    </Box>
  );
}