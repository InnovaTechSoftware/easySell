
export class BaseException extends Error{
    constructor(
        public readonly message: string,
        public readonly statusCode: number = 500, 
        public readonly error: string = 'Internal Server Error',
    ){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
} 