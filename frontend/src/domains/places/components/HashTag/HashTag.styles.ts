import { css } from '@emotion/react';

import theme from '@/styles/theme';

const PlaceInfoStyle = css`
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.blue[100]};
`;

const SelectedTagsWrapperStyle = css`
  flex-wrap: wrap;
`;

const SelectedTagStyle = css`
  border: 1px solid transparent;
`;

export { PlaceInfoStyle, SelectedTagsWrapperStyle, SelectedTagStyle };
