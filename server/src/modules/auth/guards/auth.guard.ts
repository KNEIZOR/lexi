import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthUser } from '../../../common/types/auth-user.type.js';

type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.cookies?.accessToken as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      const payload = jwt.verify(token, secret);

      if (typeof payload !== 'object' || !payload.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = {
        id: String(payload.sub),
        email: String(payload.email),
        name: payload.name ? String(payload.name) : null,
        role: payload.role as AuthUser['role'],
        learningLevel: String(payload.learningLevel),
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}