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
    <div css={ToastContainerStyle}>
      {toast?.map((item) => (
        <ToastItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Toast;

const ToastItem = ({ item }: { item: ToastInfoProps }) => {
  return (
    <div css={ToastItemWrapperStyle(item.leaving)}>
      <span css={ToastBadgeStyle(item.type)} />
      <Text variant="body" css={ToastMessageStyle}>
        {item.message}
      </Text>
    </div>
  );
};
