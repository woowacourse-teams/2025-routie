import { useRef } from 'react';

export const useCardDrag = <T>(
  items: T[],
  setItems: (updated: T[]) => void,
) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) return;

    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    setItems(updated);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const getDragProps = (index: number) => ({
    draggable: true,
    onDragStart: () => handleDragStart(index),
    onDragEnter: () => handleDragEnter(index),
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: handleDrop,
  });

  return getDragProps;
};
