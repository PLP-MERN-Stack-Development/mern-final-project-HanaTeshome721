import 'express-serve-static-core';
import { Server as SocketIOServer } from 'socket.io';
import { TokenPayload } from '../services/token.service';

declare module 'express-serve-static-core' {
  interface Application {
    get(name: 'io'): SocketIOServer;
    set(name: 'io', value: SocketIOServer): this;
  }

  interface Request {
    user?: TokenPayload;
  }
}
