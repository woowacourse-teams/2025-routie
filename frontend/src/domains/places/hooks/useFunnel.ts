import { useMemo, useState } from 'react';

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

  const isStep1 = useMemo(() => step === 1, [step]);
  const isStep2 = useMemo(() => step === 2, [step]);

  return {
    step,
    nextStep,
    prevStep,
    resetFunnel,
    isStep1,
    isStep2,
  };
};
