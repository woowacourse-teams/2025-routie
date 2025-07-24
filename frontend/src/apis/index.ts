const createApiMethod = (method: string) => async (url: string, body?: any) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return response;
};

export const apiClient = {
  get: createApiMethod('GET'),
  post: createApiMethod('POST'),
  patch: createApiMethod('PATCH'),
  delete: createApiMethod('DELETE'),
};
