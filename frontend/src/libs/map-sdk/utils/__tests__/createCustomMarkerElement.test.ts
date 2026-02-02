import { describe, expect, it } from 'vitest';

import { createCustomMarkerElement } from '@/libs/map-sdk/utils/createCustomMarkerElement';

describe('createCustomMarkerElement', () => {
  it('순서 번호가 반영된 마커 요소를 생성한다', () => {
    const element = createCustomMarkerElement(3);

    expect(element.tagName).toBe('DIV');
    expect(element.innerText).toBe('3');
  });

  it('기본 스타일이 적용된다', () => {
    const element = createCustomMarkerElement(1);

    expect(element.style.cursor).toBe('pointer');
    expect(element.style.display).toBe('flex');
    expect(element.style.alignItems).toBe('center');
    expect(element.style.justifyContent).toBe('center');
    expect(element.style.width).toBe('3rem');
    expect(element.style.height).toBe('3rem');
    expect(element.style.borderRadius).toBe('50%');
    expect(element.style.fontSize).toBe('1.6rem');
    expect(element.style.fontWeight).toBe('bold');
    expect(element.style.background).toBe('rgb(43, 108, 176)');
    expect(element.style.color).toBe('white');
  });
});
