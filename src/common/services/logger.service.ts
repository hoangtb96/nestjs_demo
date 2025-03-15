import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  protected context?: string;

  setContext(context: string) {
    this.context = context;
  }

  error(message: string, trace: string, context?: string) {
    const timestamp = new Date().toISOString();
    super.error(
      `[${timestamp}] ${message}`,
      trace,
      context || this.context,
    );
  }

  warn(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    super.warn(
      `[${timestamp}] ${message}`,
      context || this.context,
    );
  }

  log(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    super.log(
      `[${timestamp}] ${message}`,
      context || this.context,
    );
  }

  debug(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    super.debug(
      `[${timestamp}] ${message}`,
      context || this.context,
    );
  }

  verbose(message: string, context?: string) {
    const timestamp = new Date().toISOString();
    super.verbose(
      `[${timestamp}] ${message}`,
      context || this.context,
    );
  }
} 