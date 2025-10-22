import { useToggle } from './useToggle';

const useFeedback = () => {
  const { isOpen, handleToggle } = useToggle(false);

  const handleFeedbackButtonClick = () => {
    handleToggle();
  };

  const handleFeedbackPanelClose = () => {
    if (isOpen) {
      handleToggle();
    }
  };

  return {
    isOpen,
    handleFeedbackButtonClick,
    handleFeedbackPanelClose,
  };
};

export { useFeedback };
