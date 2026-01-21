import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../../src/lib/auth";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        name: string;
        emailVerified: boolean;
        status: string;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ---- Sanitize headers for BetterAuth (important) ----
      const cleanHeaders: Record<string, string> = {};
      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === "string") {
          cleanHeaders[key.trim()] = value;
        }
      }

      // ---- Get session from BetterAuth ----
      const session = await betterAuth.api.getSession({
        headers: cleanHeaders,
      });

      if (!session || !session.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required. Please login.",
        });
      }

      // ---- Email verification check ----
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email to continue.",
        });
      }

      // ---- Attach user to request ----
      req.user = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role as UserRole,
        name: session.user.name,
        emailVerified: session.user.emailVerified,
        status: (session.user as any).status,
      };

      // ---- Role based access control ----
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource.",
        });
      }

      // ---- Everything is OK ----
      return next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Authentication service error. Please try again.",
      });
    }
  };
};


export default auth;