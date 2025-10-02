// src/utils/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private isDevelopment: boolean;

    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    private log(level: LogLevel, message: string, ...args: any[]): void {
        if (!this.isDevelopment && level === 'debug') return;

        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

        switch (level) {
            case 'error':
                console.error(prefix, message, ...args);
                break;
            case 'warn':
                console.warn(prefix, message, ...args);
                break;
            case 'debug':
                console.debug(prefix, message, ...args);
                break;
            default:
                console.log(prefix, message, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        this.log('info', message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        this.log('warn', message, ...args);
    }

    error(message: string, ...args: any[]): void {
        this.log('error', message, ...args);
    }

    debug(message: string, ...args: any[]): void {
        this.log('debug', message, ...args);
    }
}

export const logger = new Logger();