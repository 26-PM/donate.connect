import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { Ngo } from '../models/Ngo';

interface AuthRequest extends NextApiRequest {
  user?: any;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const ngo = await Ngo.findById(decoded.id).select('-password');

    if (!ngo) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = ngo;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}; 