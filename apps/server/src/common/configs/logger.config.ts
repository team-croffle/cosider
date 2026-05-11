import { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
  pinoHttp: {
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    autoLogging: {
      ignore: (req) => req.url === '/health',
    },
  },
};
