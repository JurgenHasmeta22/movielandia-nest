import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AppError } from "../../utils/error.util";

interface ErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    path: string;
    timestamp: string;
}

/**
 * Catches ALL exceptions and normalises them into a consistent JSON envelope.
 * Handles:
 *   - Standard NestJS HttpException (400, 401, 404, …)
 *   - Custom AppError hierarchy from utils/error.util.ts
 *   - Unexpected runtime errors (mapped to 500)
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const { statusCode, message, error } = this.resolveError(exception);

        const body: ErrorResponse = {
            statusCode,
            message,
            error,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        if (statusCode >= 500) {
            this.logger.error(
                `[${request.method}] ${request.url} → ${statusCode}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
        }

        response.status(statusCode).json(body);
    }

    private resolveError(exception: unknown): { statusCode: number; message: string; error: string } {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            const message =
                typeof res === "string"
                    ? res
                    : (res as { message?: string | string[] }).message
                      ? Array.isArray((res as { message: string[] }).message)
                          ? (res as { message: string[] }).message.join("; ")
                          : String((res as { message: string }).message)
                      : exception.message;

            return {
                statusCode: status,
                message,
                error: exception.name.replace("Exception", ""),
            };
        }

        if (exception instanceof AppError) {
            return {
                statusCode: exception.statusCode,
                message: exception.message,
                error: exception.name,
            };
        }

        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "An unexpected error occurred",
            error: "InternalServerError",
        };
    }
}
