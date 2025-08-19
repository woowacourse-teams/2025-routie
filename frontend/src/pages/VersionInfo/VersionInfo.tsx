import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

const VersionInfo = () => {
  const buildVersion = __BUILD_VERSION__;
  const buildDate = __BUILD_DATE__;
  const buildEnv = process.env.NODE_ENV;

  return (
    <Flex direction="column" height="100dvh" gap={1}>
      <Text variant="title">버전 번호: v{buildVersion}</Text>
      <Text variant="title">빌드 환경: {buildEnv}</Text>
      <Text variant="title">빌드 날짜: {buildDate}</Text>
    </Flex>
  );
};

export default VersionInfo;
