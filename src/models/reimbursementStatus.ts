export class reimbursementStatus{
    statusId: number // primary key
    status: string // not null, unique
    constructor(statusId: number, status: string){
            this.statusId = statusId
            this.status = status
    }
  } 
  
 