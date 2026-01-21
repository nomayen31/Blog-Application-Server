import { Request, Response, NextFunction } from "express";

export function notFound(req:Request,res:Response,next:NextFunction) {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404).json({
        success: false,
        message: error.message,
        date: new Date(),
        error: error,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
}