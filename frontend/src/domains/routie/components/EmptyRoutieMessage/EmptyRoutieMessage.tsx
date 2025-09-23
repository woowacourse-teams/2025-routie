import EmptyMessage from '@/@common/components/EmptyMessage/EmptyMessage';

const EmptyRoutieMessage = () => (
  <EmptyMessage
    messages={[
      '아직 동선이 없습니다.',
      '장소 목록에서 2곳 이상을 선택하면 동선이 생성됩니다!',
    ]}
  />
);

export default EmptyRoutieMessage;
