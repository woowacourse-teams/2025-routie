import { css } from '@emotion/react';

import theme from '@/styles/theme';

const PlaceInfoStyle = css`
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.gray[50]};
`;

const SelectedTagsWrapperStyle = css`
  flex-wrap: wrap;
`;

const AddButtonStyle = css`
  height: 3.6rem;
  border-radius: ${theme.radius.lg};
`;

export { PlaceInfoStyle, SelectedTagsWrapperStyle, AddButtonStyle };
