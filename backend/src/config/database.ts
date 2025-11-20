import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(error, 'Failed to connect to MongoDB');
    process.exit(1);
  }
};
