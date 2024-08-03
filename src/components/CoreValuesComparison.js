export default function CoreValuesComparison({ issue, options, prevStep }) {
    const [coreValues, setCoreValues] = useState(defaultCoreValues);
    const [selectedValues, setSelectedValues] = useState([]);
    const [newValueDialog, setNewValueDialog] = useState(false);
    const [newValue, setNewValue] = useState({ value: '', description: '' });
    const [currentStep, setCurrentStep] = useState('select'); // 'select' or 'compare'
  
    useEffect(() => {
      const storedValues = localStorage.getItem('coreValues');
      if (storedValues) {
        setCoreValues(JSON.parse(storedValues));
      }
    }, []);
  
    const handleValueSelect = (value) => {
      setSelectedValues(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    };
  
    const handleAddValue = () => {
      setCoreValues([...coreValues, newValue]);
      setNewValue({ value: '', description: '' });
      setNewValueDialog(false);
      localStorage.setItem('coreValues', JSON.stringify([...coreValues, newValue]));
    };
  
    const handleNext = () => {
      setCurrentStep('compare');
    };
  
    if (currentStep === 'compare') {
      return <CoreValuesSwiper 
        issue={issue} 
        options={options} 
        selectedValues={selectedValues} 
        prevStep={() => setCurrentStep('select')} 
        nextStep={nextStep}
        calculateFinalScores={calculateFinalScores}
      />;
    }
    
    const calculateFinalScores = (scores) => {
      const finalScores = {};
      options.forEach(option => {
        finalScores[option] = selectedValues.reduce((sum, value) => sum + (scores[option]?.[value] || 0), 0);
      });
      return finalScores;
    };

    return (
      <Box className="space-y-4">
        <Typography variant="h2">Select Core Values</Typography>
        {coreValues.map((cv, index) => (
          <FormControlLabel
            key={index}
            control={<Checkbox checked={selectedValues.includes(cv.value)} onChange={() => handleValueSelect(cv.value)} />}
            label={`${cv.value}: ${cv.description}`}
          />
        ))}
        <Button onClick={() => setNewValueDialog(true)}>Add Core Value</Button>
        <Box className="flex justify-between">
          <Button onClick={prevStep}>Back</Button>
          <Button variant="contained" disabled={selectedValues.length === 0} onClick={handleNext}>Next</Button>
        </Box>
  
        <Dialog open={newValueDialog} onClose={() => setNewValueDialog(false)}>
          <DialogTitle>Add New Core Value</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Core Value"
              fullWidth
              value={newValue.value}
              onChange={(e) => setNewValue({ ...newValue, value: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              value={newValue.description}
              onChange={(e) => setNewValue({ ...newValue, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewValueDialog(false)}>Cancel</Button>
            <Button onClick={handleAddValue}>Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }