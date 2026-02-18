import type { FallbackRenderProps } from '@/@common/components/ErrorBoundary/ErrorBoundary.types';

import {
  SectionErrorFallbackStyle,
  RetryButtonStyle,
} from './SectionErrorFallback.styles';


const SectionErrorFallback = ({ resetErrorBoundary }: FallbackRenderProps) => (
  <div css={SectionErrorFallbackStyle}>
    <span>데이터를 불러오지 못했습니다.</span>
    <button type="button" css={RetryButtonStyle} onClick={resetErrorBoundary}>
      다시 시도
    </button>
  </div>
);

export default SectionErrorFallback;
