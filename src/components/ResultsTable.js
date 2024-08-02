import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function ResultsTable({ issue, options, prevStep }) {
  const [scores, setScores] = useState({});

  useEffect(() => {
    const storedScores = localStorage.getItem('scores');
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  return (
    <Box className="space-y-4">
      <Typography variant="h2">{issue}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Option</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {options.map((option) => (
              <TableRow key={option}>
                <TableCell component="th" scope="row">
                  {option}
                </TableCell>
                <TableCell align="right">{scores[option] || 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={prevStep}>Back to Comparison Method</Button>
    </Box>
  );
}