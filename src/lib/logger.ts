// Simple logger that works in both browser and server
const logger = {
  error: (message: string, ...args: any[]) => {
    if (typeof window === 'undefined') {
      console.error(`[ERROR] ${message}`, ...args);
    } else {
      console.error(message, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (typeof window === 'undefined') {
      console.warn(`[WARN] ${message}`, ...args);
    } else {
      console.warn(message, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    if (typeof window === 'undefined') {
      console.info(`[INFO] ${message}`, ...args);
    } else {
      console.info(message, ...args);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (typeof window === 'undefined') {
      console.debug(`[DEBUG] ${message}`, ...args);
    } else {
      console.debug(message, ...args);
    }
  },
};

export default logger;
