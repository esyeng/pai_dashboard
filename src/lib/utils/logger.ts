// utils/logger.ts

export enum LogLevel {
    INFO,
    WARN,
    ERROR,
}

interface LogData {
    [key: string]: any;
}

class Logger {
    private static instance: Logger;
    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    log(level: LogLevel, message: string, data?: LogData): void {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${LogLevel[level]}: ${message}`;

        switch (level) {
            case LogLevel.INFO:
                console.log(logMessage, data);
                break;
            case LogLevel.WARN:
                console.warn(logMessage, data);
                break;
            case LogLevel.ERROR:
                console.error(logMessage, data);
                break;
        }
    }
}

export const logger = Logger.getInstance();
