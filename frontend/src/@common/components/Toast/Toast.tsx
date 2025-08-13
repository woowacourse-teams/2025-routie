import { useContext } from 'react';

import ToastContext from '../../contexts/useToastContext';
import { ToastContextType, ToastInfoType } from '../../types/toast.type';
import Text from '../Text/Text';

import {
  containerStyle,
  itemWrapper,
  badgeStyle,
  messageStyle,
} from './Toast.styles';

const Toast = () => {
  const { toast } = useContext(ToastContext) as ToastContextType;

  return (
    <div css={containerStyle}>
      {toast?.map((item) => (
        <ToastItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Toast;

const ToastItem = ({ item }: { item: ToastInfoType }) => {
  return (
    <div css={itemWrapper(item.leaving)}>
      <span css={badgeStyle(item.type)} />
      <Text variant="caption" css={messageStyle}>
        {item.message}
      </Text>
    </div>
  );
};
