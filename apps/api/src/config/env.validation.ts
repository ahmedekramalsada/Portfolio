export const envValidationSchema = {
  NODE_ENV: {
    default: 'development',
    validate: (v: string) => ['development', 'production', 'test'].includes(v),
  },
  APP_PORT: {
    default: 4000,
    validate: (v: string) => !isNaN(Number(v)),
  },
  DATABASE_URL: {
    required: true,
    validate: (v: string) => v.startsWith('postgresql://'),
  },
  JWT_SECRET: {
    required: true,
  },
  JWT_REFRESH_SECRET: {
    required: true,
  },
} as const;
