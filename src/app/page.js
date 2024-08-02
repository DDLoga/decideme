'use client';  // Add this line at the top of the file

import { useState } from 'react';
import { Typography, Box } from '@mui/material';
import IssueInput from '../components/IssueInput';
import OptionsInput from '../components/OptionsInput';
import ComparisonMethod from '../components/ComparisonMethod';
import CoreValuesSelection from '../components/CoreValuesSelection';
import CoreValuesSwiper from '../components/CoreValuesSwiper';
import WeightedCriteriaInput from '../components/WeightedCriteriaInput';
import WeightedCriteriaComparison from '../components/WeightedCriteriaComparison';
import ResultsTable from '../components/ResultsTable';

export default function Home() {
  const [step, setStep] = useState(1);
  const [issue, setIssue] = useState('');
  const [options, setOptions] = useState([]);
  const [comparisonMethod, setComparisonMethod] = useState(null);
  const [selectedCoreValues, setSelectedCoreValues] = useState([]);
  const [scores, setScores] = useState({});

  const nextStep = (data) => {
    if (step === 4 && Array.isArray(data)) {
      setSelectedCoreValues(data);
    } else if (step === 5 && typeof data === 'object') {
      setScores(data);
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <IssueInput issue={issue} setIssue={setIssue} nextStep={nextStep} />;
      case 2:
        return <OptionsInput options={options} setOptions={setOptions} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <ComparisonMethod setComparisonMethod={setComparisonMethod} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return comparisonMethod === 'core-values' ? (
          <CoreValuesSelection 
            issue={issue}
            options={options}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        ) : (
          <WeightedCriteriaInput
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 5:
        return comparisonMethod === 'core-values' ? (
          <CoreValuesSwiper 
            issue={issue} 
            options={options} 
            selectedCoreValues={selectedCoreValues}
            prevStep={prevStep} 
            nextStep={nextStep} 
          />
        ) : (
          <WeightedCriteriaComparison
            issue={issue}
            options={options}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 6:
        return <ResultsTable 
          issue={issue}
          options={options}
          scores={scores}
          prevStep={() => setStep(3)}
        />;
      default:
        return <Typography>Invalid step</Typography>;
    }
  };

  return (
    <Box className="container mx-auto p-4">
      <Typography variant="h1" className="mb-4">Decision Helper</Typography>
      {renderStep()}
    </Box>
  );
}