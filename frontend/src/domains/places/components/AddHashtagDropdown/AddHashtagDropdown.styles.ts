import { css } from '@emotion/react';

import theme from '@/styles/theme';

const PlaceInfoStyle = css`
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.gray[50]};
`;

const HashtagAddButtonStyle = css`
  border-radius: ${theme.radius.lg};
`;

const SelectedTagsWrapperStyle = css`
  flex-wrap: wrap;
`;

export { PlaceInfoStyle, HashtagAddButtonStyle, SelectedTagsWrapperStyle };
