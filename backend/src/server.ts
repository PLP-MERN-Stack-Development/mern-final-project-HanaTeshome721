import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';

const bootstrap = async () => {
  await connectDatabase();
  const { httpServer } = createApp();

  httpServer.listen(env.PORT, () => {
    logger.info(`API ready on http://localhost:${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start server');
  process.exit(1);
});
