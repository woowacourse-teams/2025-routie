import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';
import PlaceCard from '@/domains/places/components/PlaceCard/PlaceCard';

const places = [
  {
    id: 21,
    name: '우리집',
    address: '경기도 의왕시 흥안대로 456번길 125',
    stayDurationMinutes: 60,
    openAt: '12:29',
    closeAt: '23:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['FRIDAY', 'WEDNESDAY'],
  },
  {
    id: 22,
    name: '카페 베네',
    address: '서울시 강남구 테헤란로 123',
    stayDurationMinutes: 60,
    openAt: '09:00',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['SUNDAY'],
  },
  {
    id: 23,
    name: '스타벅스',
    address: '서울시 서초구 서초대로 88',
    stayDurationMinutes: 60,
    openAt: '07:00',
    closeAt: '22:30',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: [],
  },
  {
    id: 24,
    name: '맛찬들 왕소금구이',
    address: '서울시 송파구 송파대로 456',
    stayDurationMinutes: 60,
    openAt: '11:30',
    closeAt: '21:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['MONDAY'],
  },
  {
    id: 25,
    name: '북촌 손만두',
    address: '서울시 종로구 북촌로 35',
    stayDurationMinutes: 60,
    openAt: '10:00',
    closeAt: '20:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['TUESDAY'],
  },
  {
    id: 26,
    name: '투썸플레이스',
    address: '서울시 마포구 양화로 123',
    stayDurationMinutes: 60,
    openAt: '08:00',
    closeAt: '23:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: [],
  },
  {
    id: 27,
    name: '이디야커피',
    address: '서울시 중구 명동길 50',
    stayDurationMinutes: 60,
    openAt: '07:30',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['SUNDAY'],
  },
  {
    id: 28,
    name: '맥도날드',
    address: '서울시 강북구 한천로 789',
    stayDurationMinutes: 60,
    openAt: '00:00',
    closeAt: '23:59',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: [],
  },
  {
    id: 29,
    name: '롯데시네마',
    address: '서울시 동대문구 왕산로 200',
    stayDurationMinutes: 60,
    openAt: '10:00',
    closeAt: '02:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: [],
  },
  {
    id: 30,
    name: '교보문고',
    address: '서울시 종로구 종로 1',
    stayDurationMinutes: 60,
    openAt: '09:30',
    closeAt: '22:00',
    breakStartAt: '12:00',
    breakEndAt: '13:00',
    closedDays: ['WEDNESDAY'],
  },
];

const PlaceList = () => {
  return (
    <Flex
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      width="100%"
      height="100%"
      padding={3}
      gap={2}
    >
      <Text variant="title">장소 목록</Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5,1fr)',
          gap: '2rem',
        }}
      >
        {places.map((place) => (
          <PlaceCard key={place.id} {...place} />
        ))}
      </div>
    </Flex>
  );
};

export default PlaceList;
