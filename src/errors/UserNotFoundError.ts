import { HttpError } from "./HttpError";


export class UserNotFoundError extends HttpError {
    constructor(){
        super('Invalid Credentials', 400)
    }
}