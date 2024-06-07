import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger {
  constructor(context?: string) {
    super(context, {
      logLevels: ["log", "debug", "error", "fatal", "verbose", "warn"],
      timestamp: false
    });
  }

  log(message: string, context?: string) {
    const enhancedMessage = this.addContextInfo(message);
    super.log(enhancedMessage, context);
  }

  error(message: string, trace?: string, context?: string) {
    const enhancedMessage = this.addContextInfo(message);
    super.error(enhancedMessage, trace, context);
  }

  warn(message: string, context?: string) {
    const enhancedMessage = this.addContextInfo(message);
    super.warn(enhancedMessage, context);
  }

  debug(message: string, context?: string) {
    const enhancedMessage = this.addContextInfo(message);
    super.debug(enhancedMessage, context);
  }

  verbose(message: string, context?: string) {
    const enhancedMessage = this.addContextInfo(message);
    super.verbose(enhancedMessage, context);
  }

  fatal(message: string, context?: string) {
    const enhancedMessage = this.addContextInfo(message);
    super.error(`[FATAL] ${enhancedMessage}`, '', context);
  }

  private addContextInfo(message: string): string {
    return message;
  }
}
