import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../constants/roles';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

export type TokenPayload = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

const signToken = (payload: TokenPayload, secret: string, expiresIn: string) =>
  jwt.sign(payload, secret, { expiresIn });

const verifyToken = (token: string, secret: string) => jwt.verify(token, secret) as TokenPayload;

export const tokenService = {
  signAccessToken: (payload: TokenPayload) => signToken(payload, env.JWT_ACCESS_SECRET, ACCESS_TOKEN_TTL),
  verifyAccessToken: (token: string) => verifyToken(token, env.JWT_ACCESS_SECRET),
  signRefreshToken: (payload: TokenPayload) => signToken(payload, env.JWT_REFRESH_SECRET, REFRESH_TOKEN_TTL),
  verifyRefreshToken: (token: string) => verifyToken(token, env.JWT_REFRESH_SECRET),
};

