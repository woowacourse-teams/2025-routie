import { http, HttpResponse } from 'msw';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const handlers = [
  // 개인이 필요한 api 핸들러 추가...
];
