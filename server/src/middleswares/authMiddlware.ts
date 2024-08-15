import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface DecodedToken {
  id: string;
}

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Find the user by the decoded ID and exclude the password field
    req.user = await User.findById(decoded.id).lean().select("-password")  as IUser | null;

    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
