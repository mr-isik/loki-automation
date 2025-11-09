/* eslint-disable no-console */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  stack?: string;
}

export interface RequestLog {
  id: string;
  method: string;
  url: string;
  headers?: Record<string, string>;
  data?: any;
  timestamp: Date;
}

export interface ResponseLog {
  requestId: string;
  status: number;
  statusText: string;
  data?: any;
  duration: number;
  timestamp: Date;
  errors?: string[];
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  bufferSize: number;
  flushInterval: number;
}

class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private requestStats: Map<
    string,
    {method: string; url: string; startTime: number; timestamp: Date}
  > = new Map();

  constructor(config: LoggerConfig) {
    this.config = config;
    this.startFlushTimer();
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private createLogEntry(level: LogLevel, message: string, data?: any, error?: Error): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      stack: error?.stack,
    };
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error) {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, data, error);

    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    if (this.config.enableRemote) {
      this.buffer.push(entry);
      if (this.buffer.length >= this.config.bufferSize) {
        this.flush();
      }
    }
  }

  private logToConsole(entry: LogEntry) {
    const {level, message, data} = entry;

    const isDev = process.env.NODE_ENV !== "production";

    switch (level) {
      case LogLevel.DEBUG:
        if (isDev) {
          if (data && Object.keys(data).length > 0) {
            console.debug(`🔍 ${message}`, data);
          } else {
            console.debug(`🔍 ${message}`);
          }
        }
        break;
      case LogLevel.INFO:
        if (data && Object.keys(data).length > 0) {
          console.info(`ℹ️  ${message}`, data);
        } else {
          console.info(`ℹ️  ${message}`);
        }
        break;
      case LogLevel.WARN:
        if (data && Object.keys(data).length > 0) {
          console.warn(`⚠️  ${message}`, data);
        } else {
          console.warn(`⚠️  ${message}`);
        }
        break;
      case LogLevel.ERROR:
        if (data && Object.keys(data).length > 0) {
          console.error(`❌ ${message}`, data);
        } else {
          console.error(`❌ ${message}`);
        }
        break;
    }
  }

  private async flush() {
    if (this.buffer.length === 0) return;

    const logs = [...this.buffer];

    this.buffer = [];

    try {
      if (this.config.remoteEndpoint) {
        await fetch(this.config.remoteEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({logs}),
        });
      }
    } catch (error) {
      console.error("Failed to send logs to remote endpoint:", error);
      // Re-add logs to buffer if failed
      this.buffer.unshift(...logs);
    }
  }

  private startFlushTimer() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private getCurrentUserId(): string | undefined {
    // Get from your auth store
    try {
      if (typeof window === "undefined") return undefined;
      const userStore = localStorage.getItem("user-store");

      if (userStore) {
        const parsed = JSON.parse(userStore);

        return parsed?.state?.currentUser?.id;
      }
    } catch {
      return undefined;
    }
  }

  private getSessionId(): string {
    if (typeof window === "undefined") return "server";

    let sessionId = sessionStorage.getItem("session-id");

    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("session-id", sessionId);
    }

    return sessionId;
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | any) {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    this.log(LogLevel.ERROR, message, error, errorObj);
  }

  generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  logApiRequest(request: RequestLog) {
    const isDev = process.env.NODE_ENV !== "production";

    // Store request info for statistics
    this.requestStats.set(request.id, {
      method: request.method,
      url: request.url,
      startTime: Date.now(),
      timestamp: request.timestamp,
    });

    if (isDev) {
      // Detaylı log - Development
      console.group(
        `%c→ ${request.method} %c${request.url}`,
        "color: #22c55e; font-weight: bold",
        "color: #94a3b8",
      );

      console.log("%cRequest ID:", "color: #64748b; font-weight: bold", request.id);

      if (request.headers) {
        const filteredHeaders = {...request.headers};

        // Sensitive headers'ı maskele
        if (filteredHeaders.Authorization) {
          filteredHeaders.Authorization = "Bearer ****";
        }

        console.log("%cHeaders:", "color: #64748b; font-weight: bold", filteredHeaders);
      }

      if (request.data) {
        // FormData ise özel işlem
        if (request.data instanceof FormData) {
          console.log("%cBody:", "color: #64748b; font-weight: bold", "FormData");
          const formDataEntries: Record<string, any> = {};

          request.data.forEach((value, key) => {
            if (value instanceof File) {
              formDataEntries[key] = `File: ${value.name} (${(value.size / 1024).toFixed(2)} KB)`;
            } else {
              formDataEntries[key] = value;
            }
          });
          console.table(formDataEntries);
        } else {
          console.log("%cBody:", "color: #64748b; font-weight: bold", request.data);
        }
      }

      console.log(
        "%cTimestamp:",
        "color: #64748b; font-weight: bold",
        request.timestamp.toLocaleTimeString(),
      );
      console.groupEnd();
    } else {
      // Basit log - Production
      this.debug(`→ ${request.method} ${request.url}`, {id: request.id});
    }
  }

  logApiResponse(response: ResponseLog) {
    const isDev = process.env.NODE_ENV !== "production";
    const isError = response.status >= 400;
    const isSuccess = response.status >= 200 && response.status < 300;

    // Get request info from stats
    const requestInfo = this.requestStats.get(response.requestId);

    if (requestInfo) {
      // Clean up stats
      this.requestStats.delete(response.requestId);
    }

    if (isDev) {
      // Detaylı log - Development
      const statusColor = isError ? "#ef4444" : isSuccess ? "#22c55e" : "#f59e0b";
      const statusIcon = isError ? "❌" : isSuccess ? "✅" : "⚠️";

      console.group(
        `%c${statusIcon} ${response.status} %c${response.duration}ms %c${requestInfo?.method || ""} ${requestInfo?.url || ""}`,
        `color: ${statusColor}; font-weight: bold`,
        "color: #94a3b8",
        "color: #64748b; font-size: 0.9em",
      );

      console.log("%cRequest ID:", "color: #64748b; font-weight: bold", response.requestId);
      console.log("%cStatus:", "color: #64748b; font-weight: bold", response.statusText);

      if (response.data) {
        if (isError) {
          console.error("%cResponse:", "color: #64748b; font-weight: bold", response.data);
        } else {
          console.log("%cResponse:", "color: #64748b; font-weight: bold", response.data);
        }
      }

      if (response.errors && response.errors.length > 0) {
        console.error("%cErrors:", "color: #ef4444; font-weight: bold", response.errors);
      }

      // Performance warning
      if (response.duration > 3000) {
        console.warn(
          "%c🐌 Slow Response",
          "color: #f59e0b; font-weight: bold",
          `${response.duration}ms`,
        );
      } else if (response.duration > 1000) {
        console.warn(
          "%c⏱️ Moderate Response",
          "color: #f59e0b; font-weight: bold",
          `${response.duration}ms`,
        );
      }

      console.log(
        "%cTimestamp:",
        "color: #64748b; font-weight: bold",
        response.timestamp.toLocaleTimeString(),
      );
      console.groupEnd();
    } else {
      // Basit log - Production
      if (response.errors && response.errors.length > 0) {
        this.error(`← ${response.status} (${response.duration}ms)`, {
          requestId: response.requestId,
          errors: response.errors,
        });
      } else if (isError) {
        this.warn(`← ${response.status} (${response.duration}ms)`, {
          requestId: response.requestId,
        });
      } else {
        this.debug(`← ${response.status} (${response.duration}ms)`);
      }
    }
  }

  // Request summary
  getRequestSummary() {
    if (this.requestStats.size === 0) {
      this.info("No pending requests");

      return;
    }

    console.group("%c📊 Pending Requests Summary", "color: #3b82f6; font-weight: bold");
    console.log(`Total: ${this.requestStats.size}`);

    const requests = Array.from(this.requestStats.entries()).map(([id, info]) => ({
      ID: id,
      Method: info.method,
      URL: info.url,
      "Elapsed Time": `${Date.now() - info.startTime}ms`,
      Started: info.timestamp.toLocaleTimeString(),
    }));

    console.table(requests);
    console.groupEnd();
  }

  // Performance logging
  time(label: string) {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-start`);
    }
  }

  timeEnd(label: string) {
    if (typeof performance !== "undefined") {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measures = performance.getEntriesByName(label);
      const duration = measures[measures.length - 1]?.duration;

      // Sadece yavaş işlemleri logla (>1000ms)
      if (duration && duration > 1000) {
        this.warn(`Slow Performance: ${label}`, {
          duration: `${duration?.toFixed(2)}ms`,
        });
      } else if (duration) {
        this.debug(`⚡ ${label}: ${duration?.toFixed(2)}ms`);
      }

      // Cleanup
      performance.clearMarks(`${label}-start`);
      performance.clearMarks(`${label}-end`);
      performance.clearMeasures(label);
    }
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }
}

const loggerConfig: LoggerConfig = {
  level: process.env.NODE_ENV === "production" ? LogLevel.WARN : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === "production",
  remoteEndpoint: process.env.NEXT_PUBLIC_LOG_ENDPOINT,
  bufferSize: 10,
  flushInterval: 30000, // 30 seconds
};

export const logger = new Logger(loggerConfig);

if (typeof window !== "undefined") {
  // Make logger accessible in development console
  if (process.env.NODE_ENV !== "production") {
    (window as any).__logger = logger;
    console.info(
      "%c🔍 Logger available in console as __logger",
      "color: #3b82f6; font-weight: bold",
    );
    console.info("%c💡 Try: __logger.getRequestSummary()", "color: #64748b");
  }

  window.addEventListener("beforeunload", () => {
    logger.destroy();
  });
}
