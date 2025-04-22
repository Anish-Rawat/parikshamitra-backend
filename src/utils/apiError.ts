class ApiError extends Error {
    statusCode: number;
    message: string;
    data: any;
    errors: any[];
    success: boolean;

    constructor(statusCode: number, message: string = "Something went wrong", errors: any[] = [], data: any = null, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;
