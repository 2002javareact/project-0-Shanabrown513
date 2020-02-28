import { HttpError } from "./HttpError";


export class UnauthorizedError extends HttpError{
    constructor(){
        super('The incoming token has expired', 401)
    }
}

