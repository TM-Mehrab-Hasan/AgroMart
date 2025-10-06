import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. No token provided.',
        },
      });
      return;
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: string;
    };

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid token. User not found.',
        },
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Account is deactivated.',
        },
      });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || '',
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token.',
      },
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required.',
        },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions.',
        },
      });
      return;
    }

    next();
  };
};