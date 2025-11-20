import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { tokenService } from '../services/token.service';
import { UserRole } from '../constants/roles';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
    name: string;
  };
}

const extractToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  return null;
};

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return next(createHttpError(401, 'Authentication required'));
  }

  try {
    const payload = tokenService.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    next(createHttpError(401, 'Invalid or expired token'));
  }
};

export const authorizeRoles =
  (...roles: UserRole[]) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createHttpError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, 'Insufficient permissions'));
    }

    next();
  };

