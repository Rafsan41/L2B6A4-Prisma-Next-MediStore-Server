import { NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response) {
    res.status(404).json({
        success: false,
        message: "Router Not Found",
        path: req.originalUrl,
        date: Date(),
        error: "The requested resource could not be found.",
    });
}

