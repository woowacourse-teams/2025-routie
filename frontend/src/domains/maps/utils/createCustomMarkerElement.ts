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
