import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HashtagAddButtonStyle = css`
  border-radius: ${theme.radius.lg};
`;

const SelectedTagsWrapperStyle = css`
  flex-wrap: wrap;
`;

const EditDropdownContainerStyle = css`
  position: relative;
  border: 1px solid ${theme.colors.blue[200]};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.blue[50]};
`;

export {
  HashtagAddButtonStyle,
  SelectedTagsWrapperStyle,
  EditDropdownContainerStyle,
};
