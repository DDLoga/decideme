import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

export default function IssueInput({ issue, setIssue, nextStep }) {
  const [localIssue, setLocalIssue] = useState(issue);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIssue(localIssue);
    nextStep();
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      className="h-[80vh] flex flex-col space-y-8 justify-center items-center"
      >
      <TextField
        fullWidth
        label="Issue to be addressed"
        value={localIssue}
        onChange={(e) => setLocalIssue(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" disabled={!localIssue}>
        Next
      </Button>
    </Box>
  );
}