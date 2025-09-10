interface ErrorResponseType {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: string;
}

export type { ErrorResponseType };
