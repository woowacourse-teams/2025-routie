import { describe, expect, it } from 'vitest';

import {
  createCustomMarkerElement,
  MARKER_STYLE,
} from '@/libs/map-sdk/utils/createCustomMarkerElement';

describe('createCustomMarkerElement', () => {
  it('순서 번호가 반영된 마커 요소를 생성한다', () => {
    const element = createCustomMarkerElement(3);

    expect(element.tagName).toBe('DIV');
    expect(element.innerText).toBe('3');
  });

  it('기본 스타일이 적용된다', () => {
    const element = createCustomMarkerElement(1);

    expect(element.style.cursor).toBe(MARKER_STYLE.cursor);
    expect(element.style.display).toBe(MARKER_STYLE.display);
    expect(element.style.alignItems).toBe(MARKER_STYLE.alignItems);
    expect(element.style.justifyContent).toBe(MARKER_STYLE.justifyContent);
    expect(element.style.width).toBe(MARKER_STYLE.width);
    expect(element.style.height).toBe(MARKER_STYLE.height);
    expect(element.style.borderRadius).toBe(MARKER_STYLE.borderRadius);
    expect(element.style.fontSize).toBe(MARKER_STYLE.fontSize);
    expect(element.style.fontWeight).toBe(MARKER_STYLE.fontWeight);
    expect(element.style.background).toBe('rgb(43, 108, 176)');
    expect(element.style.color).toBe(MARKER_STYLE.color);
  });

});
