import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma/enums";

import { auth as betterAuth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}



const auth = (...role: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // get Session
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (role.length && !role.includes(req.user.role as UserRole)) {
        return res.status(400).json({
          success: false,
          message: "Forbidden",
        });
      }
      next()
    } catch (err) {}
  };
};

export default auth;