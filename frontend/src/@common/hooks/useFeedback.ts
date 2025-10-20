import { useToggle } from './useToggle';

export const useFeedback = () => {
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
