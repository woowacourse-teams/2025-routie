import '@/styles/reset.css';
import '@/styles/font.css';

import React from 'react';
import { BrowserRouter } from 'react-router';

import type { Preview } from '@storybook/react-webpack5';
import type { ReactRenderer } from '@storybook/react';
import type { DecoratorFunction } from '@storybook/csf';

const withRouter: DecoratorFunction<ReactRenderer> = (Story) =>
  React.createElement(BrowserRouter, null, React.createElement(Story));

const preview: Preview = {
  decorators: [withRouter],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
