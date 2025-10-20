import { css } from '@emotion/react';

import theme from '@/styles/theme';

const ContainerStyle = css`
  position: relative;
`;

const SearchBoxWrapperStyle = css`
  position: absolute;
  z-index: 1000;
  top: 100%;
  right: 0;
  left: 0;

  margin-top: 0.5rem;
`;

const DropdownContainerStyle = css`
  border: 1px solid ${theme.colors.gray[100]};
  border-radius: ${theme.radius.sm};
  background-color: ${theme.colors.white};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -1px rgb(0 0 0 / 6%);
`;

const ListStyle = css`
  overflow-y: auto;
  width: 100%;
  max-height: 25rem;
`;

const SearchButtonStyle = css`
  height: 4rem;
`;

export {
  ContainerStyle,
  SearchBoxWrapperStyle,
  DropdownContainerStyle,
  ListStyle,
  SearchButtonStyle,
};
