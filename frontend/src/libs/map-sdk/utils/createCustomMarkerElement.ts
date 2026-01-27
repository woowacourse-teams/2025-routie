/**
 * 커스텀 마커 DOM 요소 생성
 *
 * @param sequence - 마커에 표시할 순서 번호
 * @returns 커스텀 마커 요소
 */
const createCustomMarkerElement = (sequence: number) => {
  const content = document.createElement('div');
  Object.assign(content.style, {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: 'white',
    background: '#2b6cb0',
  });
  content.innerText = String(sequence);
  return content;
};

export { createCustomMarkerElement };
