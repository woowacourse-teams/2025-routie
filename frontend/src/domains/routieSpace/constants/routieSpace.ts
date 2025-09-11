const MAX_NAME_LENGTH = 15 as const;

const ERROR_MESSAGE = {
  noName: '루티 스페이스 이름은 비어있을 수 없습니다.',
  invalidNameLength: `루티 스페이스 이름은 ${MAX_NAME_LENGTH}자 이하여야 합니다.`,
} as const;

export { MAX_NAME_LENGTH, ERROR_MESSAGE };
