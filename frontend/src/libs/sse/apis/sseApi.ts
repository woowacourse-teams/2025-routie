import { apiClient } from '@/apis';

interface PatchSseSubscriptionParams {
  subscriptionPath: string;
  token: string;
}

const patchSseSubscription = async ({ token }: PatchSseSubscriptionParams) => {
  const routieSpaceUuid = localStorage.getItem('routieSpaceUuid');

  const response = await apiClient.patch(
    `/v1/routie-spaces/${routieSpaceUuid}/server-sent-events/subscriptions/${token}`,
    null,
  );

  if (!response.ok) {
    throw new Error('sse 연결 실패');
  }
};

export { patchSseSubscription };
