/** @jsxImportSource @emotion/react */
import { memo, useEffect, useRef, useState } from 'react';

import Button from '@/@common/components/Button/Button';
import Flex from '@/@common/components/Flex/Flex';
import Icon from '@/@common/components/IconSvg/Icon';
import Text from '@/@common/components/Text/Text';
import theme from '@/styles/theme';

import {
  DragIconStyle,
  KebabButtonStyle,
  KebabDropdownStyle,
  KebabIconTextStyle,
  KebabMenuContainerStyle,
  RoutiePlaceCardContainerStyle,
} from './RoutiePlaceCard.styles';

import type { RoutiePlaceCardProps } from './RoutiePlaceCard.types';

const RoutiePlaceCard = ({ place, onDelete }: RoutiePlaceCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    onDelete();
  };

  return (
    <Flex
      data-card-element
      css={RoutiePlaceCardContainerStyle}
      padding="1.2rem"
      flex={1}
    >
      <Flex justifyContent="space-between" gap={1.5}>
        <Flex direction="column" alignItems="flex-start" gap={1.1}>
          <Text variant="body" ellipsis>
            {place.name}
          </Text>
          <Flex gap={0.4} justifyContent="flex-start">
            <Icon name="pin" size={12} />
            <Text variant="label" color={theme.colors.gray[300]} ellipsis>
              {place.roadAddressName || place.addressName}
            </Text>
          </Flex>
        </Flex>
        <Flex gap={0.5} width="20%">
          <div css={KebabMenuContainerStyle} ref={menuRef}>
            <button
              css={KebabButtonStyle}
              onClick={handleMenuToggle}
              aria-label="메뉴 열기"
              aria-expanded={isMenuOpen}
            >
              <span css={KebabIconTextStyle}>⋮</span>
            </button>
            {isMenuOpen && (
              <Flex direction="column" css={KebabDropdownStyle} padding={0.8}>
                <Button
                  variant="dangerSecondary"
                  padding="0.6rem 1.2rem"
                  width="auto"
                  onClick={handleDeleteClick}
                  aria-label="동선에서 삭제"
                >
                  <Text variant="caption" color={theme.colors.white}>
                    동선에서 삭제
                  </Text>
                </Button>
              </Flex>
            )}
          </div>
          <Icon name="drag" size={24} css={DragIconStyle} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default memo(RoutiePlaceCard);
