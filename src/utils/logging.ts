import { Logger as SlackLogger, LogLevel as SlackLogLevel } from '@slack/logger';
import { Level as PinoLogLevel, LogFn, Logger as PinoLogger } from 'pino';
import { isPlainObject, tail } from 'lodash';

const MAPPING: Record<SlackLogLevel, PinoLogLevel> = {
  [SlackLogLevel.DEBUG]: 'debug',
  [SlackLogLevel.INFO]: 'info',
  [SlackLogLevel.WARN]: 'warn',
  [SlackLogLevel.ERROR]: 'error',
};

const slackToPinoLogLevel = (level: SlackLogLevel): PinoLogLevel => {
  return MAPPING[level];
};
const pinoToSlackLogLevel = (level: string): SlackLogLevel => {
  switch (level) {
    case 'debug':
      return SlackLogLevel.DEBUG;
    case 'fatal':
      return SlackLogLevel.ERROR;
    case 'error':
      return SlackLogLevel.ERROR;
    case 'warn':
      return SlackLogLevel.WARN;
    case 'info':
      return SlackLogLevel.INFO;
    case 'trace':
      return SlackLogLevel.DEBUG;
    default:
      return SlackLogLevel.INFO;
  }
};

function logWithPino(logFn: LogFn, msg: any[]) {
  if (msg.length === 1) {
    logFn(msg[0]);
  } else if (msg.length === 2 && isPlainObject(msg[1])) {
    logFn(msg[1], msg[0]);
  } else if (msg.length >= 2) {
    logFn({ data: tail(msg) }, msg[0]);
  }
}

export const createPinoSlackLogger = (inputLogger: PinoLogger<{ name: string }>): SlackLogger => {
  let logger = inputLogger;

  return {
    setLevel: (level: SlackLogLevel) => {
      logger.level = slackToPinoLogLevel(level);
    },
    getLevel: () => pinoToSlackLogLevel(logger.level),
    setName: (name: string) => {
      logger = logger.child({ name });
    },
    error: (...msg: any[]) => logWithPino(logger.error.bind(logger), msg),
    warn: (...msg: any[]) => logWithPino(logger.warn.bind(logger), msg),
    info: (...msg: any[]) => logWithPino(logger.info.bind(logger), msg),
    debug: (...msg: any[]) => logWithPino(logger.debug.bind(logger), msg),
  };
};
