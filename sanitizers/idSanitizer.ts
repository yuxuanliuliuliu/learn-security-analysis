import { Request, Response, NextFunction } from 'express';

export interface RequestWithSanitizedId extends Request {
    sanitizedId?: string;
}

export const validateIdMiddleware = (req: RequestWithSanitizedId, res: Response, next: NextFunction) => {
    const id = req.query.id;
  
    // Check if `id` exists and is a string
    if (typeof id !== 'string') {
      return res.status(400).send("Invalid ID: ID must be a string.");
    }
    // Validate length and alphanumeric characters
    const isValidId = /^[a-zA-Z0-9]{24}$/.test(id);
    if (!isValidId) {
      return res.status(400).send("Invalid ID: ID must be a 24-character alphanumeric string.");
    }
  
    req.sanitizedId = id;
  
    // Pass control to the next middleware or route handler
    next();
  };