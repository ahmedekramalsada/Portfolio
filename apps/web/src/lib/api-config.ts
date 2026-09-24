const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = '/api/v1';

export const SERVER_API_URL = trimTrailingSlash(
  process.env.API_URL || 'http://localhost:4000/api/v1',
);
