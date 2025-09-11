import ReactGA from 'react-ga4';

interface EventTriggerType {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

const useGoogleEventTrigger = () => {
  const triggerEvent = ({
    action,
    category,
    label,
    value,
  }: EventTriggerType) => {
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
  };

  return { triggerEvent };
};

export { useGoogleEventTrigger };
