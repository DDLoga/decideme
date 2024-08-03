import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

export default function ResultsTable({ issue, options, scores: initialScores, prevStep }) {
  const [scores, setScores] = useState(initialScores || {});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const storedScores = localStorage.getItem('currentScores');
    if (storedScores) {
      const parsedScores = JSON.parse(storedScores);
      setScores(parsedScores);
    } else if (initialScores && Object.keys(initialScores).length > 0) {
      setScores(initialScores);
    }
  }, [initialScores]);

  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      const reindexedScores = reindexScores(scores);
      const data = Object.entries(reindexedScores).map(([option, score]) => ({
        id: option,
        value: score,
        label: option,
      }));
      setChartData(data);
    }
  }, [scores]);

  const reindexScores = (originalScores) => {
    const values = Object.values(originalScores);
    const minScore = Math.min(...values);
    const offset = minScore <= 0 ? Math.abs(minScore) + 1 : 0;
    
    return Object.entries(originalScores).reduce((acc, [option, score]) => {
      acc[option] = score + offset;
      return acc;
    }, {});
  };

  return (
    <Box className="space-y-4 flex flex-col items-center">
      <Typography variant="h2">{issue}</Typography>
      <Typography variant="h4">Results</Typography>
      {chartData.length > 0 ? (
        <PieChart
          series={[
            {
              data: chartData,
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: -90,
              endAngle: 180,
              cx: 150,
              cy: 150,
            }
          ]}
          width={400}
          height={300}
        />
      ) : (
        <Typography>No data available</Typography>
      )}
      <Box>
        {Object.entries(scores).map(([option, score]) => (
          <Typography key={option}>
            {option}: {score.toFixed(0)}
          </Typography>
        ))}
      </Box>
      <Button onClick={prevStep} variant="contained">Back to Comparison Method</Button>
    </Box>
  );
}