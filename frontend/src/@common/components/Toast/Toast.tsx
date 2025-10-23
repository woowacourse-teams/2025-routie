import { useToastContext } from '../../contexts/useToastContext';
import Text from '../Text/Text';

import {
  ToastContainerStyle,
  ToastItemWrapperStyle,
  ToastBadgeStyle,
  ToastMessageStyle,
} from './Toast.styles';

import type { ToastInfoProps } from './Toast.types';

const Toast = () => {
  const { toast } = useToastContext();

  return (
    <div css={ToastContainerStyle} aria-live="assertive" aria-atomic="true">
      {toast?.map((item) => (
        <ToastItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Toast;

const ToastItem = ({ item }: { item: ToastInfoProps }) => {
  return (
    <div
      css={ToastItemWrapperStyle(item.leaving)}
      role="alert"
      aria-live="assertive"
      aria-describedby="toast"
    >
      <span css={ToastBadgeStyle(item.type)} />
      <Text id="toast" variant="body" css={ToastMessageStyle}>
        {item.message}
      </Text>
    </div>
  );
};
