import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function ResultsTable({ issue, options, prevStep }) {
  const [scores, setScores] = useState({});

  useEffect(() => {
    const storedScores = localStorage.getItem('weightedCriteriaScores') || localStorage.getItem('scores');
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  const sortedOptions = [...options].sort((a, b) => scores[b] - scores[a]);

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
            {sortedOptions.map((option) => (
              <TableRow key={option}>
                <TableCell component="th" scope="row">
                  {option}
                </TableCell>
                <TableCell align="right">{scores[option] ? scores[option].toFixed(2) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={prevStep}>Back to Comparison Method</Button>
    </Box>
  );
}