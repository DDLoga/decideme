import { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function ResultsTable({ issue, options, scores: initialScores, prevStep }) {
  const [scores, setScores] = useState(initialScores || {});

  useEffect(() => {
    const storedScores = localStorage.getItem('currentScores');
    console.log('ResultsTable storedScores:', storedScores);
    if (storedScores) {
      const parsedScores = JSON.parse(storedScores);
      console.log('ResultsTable parsedScores:', parsedScores);
      setScores(parsedScores);
    } else if (initialScores && Object.keys(initialScores).length > 0) {
      console.log('Using initialScores:', initialScores);
      setScores(initialScores);
    } else {
      console.log('No stored scores found');
    }
  }, [initialScores]);


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