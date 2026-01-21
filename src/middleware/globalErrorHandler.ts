import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../generated/prisma/client';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorDetails = err;

    // Handle AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handle Prisma Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Duplicate key error';
            const target = (err.meta as any)?.target;
            if (target) {
                message = `A record with this ${target} already exists.`;
            }
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Record not found';
        }
    }

    // Handle Prisma Validation Errors
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "You provided incorrect field type or missing field";
    }

    // Handle Prisma Unknown Request Error
    if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        message = 'Unknown Prisma Request Error';
    }

    // Handle Prisma Initialization Error
    if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = 500;
        message = 'Prisma Initialization Error: Database connection failed';
    }

    // Handle Prisma Rust Panic Error
    if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        message = 'Prisma Rust Panic Error';
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: errorDetails,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};


export default globalErrorHandler;
