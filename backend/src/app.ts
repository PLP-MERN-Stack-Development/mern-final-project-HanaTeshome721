import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env';
import { logger } from './utils/logger';
import { apiRouter } from './routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.get('/health', (_, res) => res.json({ status: 'ok' }));
  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  io.on('connection', (socket) => {
    logger.info({ id: socket.id }, 'Socket connected');
    socket.on('disconnect', () => logger.info({ id: socket.id }, 'Socket disconnected'));
  });

  app.set('io', io);

  return { app, httpServer, io };
};
