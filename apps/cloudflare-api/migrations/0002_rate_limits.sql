CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_expiry ON rate_limits(expires_at);
