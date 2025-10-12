import { useRef } from 'react';

const useCardDrag = <T>(items: T[], setItems: (updated: T[]) => void) => {
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (index: number, e: React.DragEvent) => {
    dragItem.current = index;

    // 드래그 이미지로 카드 영역만 설정
    const target = e.currentTarget as HTMLElement;
    const cardElement = target.querySelector(
      '[data-card-element]',
    ) as HTMLElement;

    if (cardElement) {
      // 카드 요소를 드래그 이미지로 설정 (오프셋은 마우스 포인터 위치)
      e.dataTransfer.setDragImage(
        cardElement,
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY,
      );
    }
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDrop = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const updated = [...items];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    setItems(updated);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const getDragProps = (index: number) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(index, e),
    onDragEnter: () => handleDragEnter(index),
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: handleDrop,
  });

  return getDragProps;
};

export { useCardDrag };
