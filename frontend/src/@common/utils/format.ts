const addHashtagPrefix = (tag: string): string => {
  return tag.startsWith('#') ? tag : `#${tag}`;
};

const removeHashtagPrefix = (tag: string): string => {
  return tag.startsWith('#') ? tag.slice(1) : tag;
};

export { addHashtagPrefix, removeHashtagPrefix };
