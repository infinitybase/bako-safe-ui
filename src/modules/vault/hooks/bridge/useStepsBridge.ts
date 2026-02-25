import { useState } from 'react';

// TODO: REMOVE THIS HOOK
// The steps management has been moved to FormBridgeProvider.
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
