import { css } from '@emotion/react';

import theme from '@/styles/theme';

const HashtagAddButtonStyle = css`
  border-radius: ${theme.radius.lg};
`;

const SelectedTagsWrapperStyle = css`
  flex-wrap: wrap;
`;

const EditDropdownContainerStyle = css`
  position: absolute;
  z-index: 10;
  right: 1.6rem;
  left: 1.6rem;

  margin-bottom: 1rem;
  padding: 1rem 2rem;
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: 0 0 ${theme.radius.sm} ${theme.radius.sm};

  background-color: ${theme.colors.white};
  box-shadow: 2px 4px 4px 0 rgb(0 0 0 / 15%);
`;

export {
  HashtagAddButtonStyle,
  SelectedTagsWrapperStyle,
  EditDropdownContainerStyle,
};
