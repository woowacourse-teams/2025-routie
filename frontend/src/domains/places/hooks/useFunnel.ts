import { useState } from 'react';

type StepType = 1 | 2;

export const useFunnel = () => {
  const [step, setStep] = useState<StepType>(1);

  const nextStep = () => {
    setStep((prev) => (prev === 1 ? 2 : prev));
  };

  const prevStep = () => {
    setStep((prev) => (prev === 2 ? 1 : prev));
  };

  const resetFunnel = () => {
    setStep(1);
  };

  return {
    step,
    nextStep,
    prevStep,
    resetFunnel,
  };
};
