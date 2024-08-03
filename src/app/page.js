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
import ProConsInput from '../components/ProConsInput';
import ProConsComparison from '../components/ProConsComparison';

export default function Home() {
  const [step, setStep] = useState(1);
  const [issue, setIssue] = useState('');
  const [options, setOptions] = useState([]);
  const [comparisonMethod, setComparisonMethod] = useState(null);
  const [selectedCoreValues, setSelectedCoreValues] = useState([]);
  const [scores, setScores] = useState({});
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);

  const nextStep = (data) => {
    if (step === 4) {
      if (comparisonMethod === 'core-values' && Array.isArray(data)) {
        setSelectedCoreValues(data);
      } else if (comparisonMethod === 'pro-cons' && data.pros && data.cons) {
        setPros(data.pros);
        setCons(data.cons);
      }
    } else if (step === 5 && typeof data === 'object') {
      setScores(data);
      localStorage.setItem('currentScores', JSON.stringify(data));
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
        switch (comparisonMethod) {
          case 'core-values':
            return <CoreValuesSelection issue={issue} options={options} prevStep={prevStep} nextStep={nextStep} />;
          case 'weighted-criteria':
            return <WeightedCriteriaInput prevStep={prevStep} nextStep={nextStep} />;
          case 'pro-cons':
            return <ProConsInput issue={issue} options={options} prevStep={prevStep} nextStep={nextStep} />;
          default:
            return <Typography>Invalid comparison method</Typography>;
        }
        case 5:
          switch (comparisonMethod) {
            case 'core-values':
              return <CoreValuesSwiper issue={issue} options={options} selectedCoreValues={selectedCoreValues} prevStep={prevStep} nextStep={nextStep} />;
            case 'weighted-criteria':
              return <WeightedCriteriaComparison issue={issue} options={options} prevStep={prevStep} nextStep={nextStep} />;
            case 'pro-cons':
              return <ProConsComparison issue={issue} options={options} pros={pros} cons={cons} prevStep={prevStep} nextStep={nextStep} />;
            default:
              return <Typography>Invalid comparison method</Typography>;
          }
        case 6:
          return <ResultsTable issue={issue} options={options} scores={scores} prevStep={() => setStep(3)} />;default:
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