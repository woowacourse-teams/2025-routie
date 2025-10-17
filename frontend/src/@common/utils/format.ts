const formatHashtag = (tag: string): string => {
  return tag.startsWith('#') ? tag : `#${tag}`;
};

export { formatHashtag };
