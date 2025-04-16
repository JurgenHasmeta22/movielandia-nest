export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string,
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(404, `${resource} not found`);
        this.name = "NotFoundError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
        this.name = "ValidationError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(401, message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(403, message);
        this.name = "ForbiddenError";
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(409, message);
        this.name = "ConflictError";
    }
}
