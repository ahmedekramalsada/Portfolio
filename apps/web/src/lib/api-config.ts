const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const API_BASE_URL = '/api/v1';

export const SERVER_API_URL = trimTrailingSlash(
  process.env.API_URL || (process.env.NODE_ENV === 'production'
    ? 'https://ahmed-os-api.aekram8.workers.dev/api/v1'
    : 'http://localhost:4000/api/v1'),
);
