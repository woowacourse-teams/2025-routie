import ReactGA from 'react-ga4';

type EventTriggerTypes = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

export const useGoogleEventTrigger = () => {
  const triggerEvent = ({
    action,
    category,
    label,
    value,
  }: EventTriggerTypes) => {
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
  };

  return { triggerEvent };
};
