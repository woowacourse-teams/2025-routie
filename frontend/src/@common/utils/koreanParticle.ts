const getSubjectParticle = (word: string | undefined): string => {
  if (!word) return '이/가';

  const lastChar = word.charAt(word.length - 1);
  const lastCharCode = lastChar.charCodeAt(0);

  // 한글 유니코드 범위: 0xAC00 ~ 0xD7A3
  if (lastCharCode < 0xac00 || lastCharCode > 0xd7a3) {
    return '이/가'; // 한글이 아니면 기본값
  }

  // 받침 확인: (lastCharCode - 0xAC00) % 28 === 0이면 받침 없음
  const hasFinalConsonant = (lastCharCode - 0xac00) % 28 !== 0;
  return hasFinalConsonant ? '이' : '가';
};

export { getSubjectParticle };
