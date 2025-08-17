import Flex from '@/@common/components/Flex/Flex';
import Text from '@/@common/components/Text/Text';

const VersionInfo = () => {
  const commitHash = __COMMIT_HASH__;
  const buildVersion = __BUILD_VERSION__;
  const buildDate = __BUILD_DATE__;
  const buildEnv = process.env.NODE_ENV;

  const githubCommitUrl = `https://github.com/woowacourse-teams/2025-routie/commit/${commitHash}`;
  const githubReleaseUrl = `https://github.com/woowacourse-teams/2025-routie/releases/tag/v${buildVersion}`;

  return (
    <Flex direction="column" height="100dvh" gap={1}>
      <Text variant="title">
        버전 번호:{' '}
        <a href={githubReleaseUrl} target="_blank" rel="noopener noreferrer">
          v{buildVersion}
        </a>
      </Text>
      <Text variant="title">빌드 환경: {buildEnv}</Text>
      <Text variant="title">빌드 날짜: {buildDate}</Text>
      <Text variant="title">
        마지막 커밋 정보:{' '}
        <a href={githubCommitUrl} target="_blank" rel="noopener noreferrer">
          {commitHash}
        </a>
      </Text>
    </Flex>
  );
};

export default VersionInfo;
