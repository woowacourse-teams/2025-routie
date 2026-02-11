import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SuspenseFallback from '../SuspenseFallback';

describe('SuspenseFallback', () => {
  it('Spinner를 렌더링한다', () => {
    render(<SuspenseFallback />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
