import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
}

/**
 * Wraps every successful controller response in a consistent envelope:
 * {
 *   "statusCode": 200,
 *   "message": "Success",
 *   "data": <original payload>,
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 *
 * 204 No Content responses are passed through as-is (no body).
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | null> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | null> {
        const response = context.switchToHttp().getResponse<Response>();

        return next.handle().pipe(
            map((data) => {
                const statusCode = response.statusCode;

                // 204 No Content — do not add a body
                if (statusCode === 204) {
                    return null;
                }

                return {
                    statusCode,
                    message: "Success",
                    data,
                    timestamp: new Date().toISOString(),
                };
            }),
        );
    }
}
