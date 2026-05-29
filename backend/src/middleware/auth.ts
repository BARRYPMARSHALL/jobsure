import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jobsure-dev-secret-key';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as any;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '30d' });
}

export function hashPassword(password: string): string {
  const bcrypt = require('bcryptjs');
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  const bcrypt = require('bcryptjs');
  return bcrypt.compareSync(password, hash);
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' });
}
