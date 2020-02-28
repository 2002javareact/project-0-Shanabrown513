import { HttpError } from "./HttpError";


export class reimbursementNotFoundError extends HttpError {
    constructor(){
        super('Reimbursement Not Found', 404)
    }
}
