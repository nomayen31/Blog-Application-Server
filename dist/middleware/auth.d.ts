import { NextFunction, Request, Response } from "express";
export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
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
            };
        }
    }
}
declare const auth: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default auth;
//# sourceMappingURL=auth.d.ts.map