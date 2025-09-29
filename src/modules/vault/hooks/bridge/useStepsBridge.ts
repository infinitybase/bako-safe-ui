import { useState } from 'react';

const useStepsBridge = () => {
  const [stepsForm, setStepsForm] = useState(0);
  const [screenBridge, setScreenBridge] = useState<'form' | 'resume'>('form');

  return {
    screenBridge,
    stepsForm,
    setScreenBridge,
    setStepsForm,
  };
};

export { useStepsBridge };
