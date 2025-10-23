import { ERROR_MESSAGES } from '@/@common/constants/message';
import { logout } from '@/@common/utils/logout';
import type { ErrorResponseType } from '@/apis/types/apIResponse.types';

const createApiMethod =
  (method: string) =>
  async (url: string, body?: any, headers?: Record<string, string>) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response;
  };

const handleApiError = async (response: Response) => {
  const errorData = (await response.json()) as ErrorResponseType;

  if (response.status === 401 && errorData?.code === 'ATH-002') {
    logout();
    return;
  }

  const errorMessage =
    ERROR_MESSAGES[errorData.code as keyof typeof ERROR_MESSAGES] ||
    '알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.';
  throw new Error(errorMessage);
};

export const apiClient = {
  get: createApiMethod('GET'),
  post: createApiMethod('POST'),
  put: createApiMethod('PUT'),
  patch: createApiMethod('PATCH'),
  delete: createApiMethod('DELETE'),
};
