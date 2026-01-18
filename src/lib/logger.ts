type LogLevel = "info" | "warn" | "error";

function log(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
) {
  const timestamp = new Date().toISOString();

  const payload = {
    timestamp,
    level,
    message,
    ...(meta && { meta }),
  };

  console[level](JSON.stringify(payload));
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    log("info", message, meta),

  warn: (message: string, meta?: Record<string, unknown>) =>
    log("warn", message, meta),

  error: (message: string, meta?: Record<string, unknown>) =>
    log("error", message, meta),
};
