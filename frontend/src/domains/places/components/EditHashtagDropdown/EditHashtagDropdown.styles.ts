import { css } from '@emotion/react';

import theme from '@/styles/theme';

const SelectedTagsWrapperStyle = css`
  flex-wrap: wrap;
`;

const EditDropdownContainerStyle = css`
  position: relative;
  border: 1px solid ${theme.colors.blue[200]};
  border-radius: ${theme.radius.md};
  background-color: ${theme.colors.blue[50]};
`;

const AddButtonStyle = css`
  height: 3.6rem;
  border-radius: ${theme.radius.lg};
`;

export { SelectedTagsWrapperStyle, EditDropdownContainerStyle, AddButtonStyle };
