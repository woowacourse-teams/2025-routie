interface RoutieSpaceListItemProps {
  name: string;
  routieSpaceUuid: string;
  date: Date;
  onClickRoutieSpace: (routieSpaceUuid: string) => void;
  onDeleteRoutieSpace: (routieSpaceUuid: string) => void;
}

export type { RoutieSpaceListItemProps };
