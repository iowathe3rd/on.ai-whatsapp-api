import { LoggerInterface } from 'src/types/logger';

export default class Logger implements LoggerInterface {
  private name: string;
  private debug: boolean | undefined;

  constructor(name: string, debug?: boolean) {
    this.name = name;
    this.debug = debug;
  }

  log(...data: any[]) {
    if (this.debug) {
      let prefix = `[ ${Date.now()} ]`;
      if (this.name) {
        prefix += ` - ${this.name}`;
      }
      console.log.apply(console, [prefix, ': ', ...data]);
    }
  }
}
