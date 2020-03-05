// this is what the field names from the database are
export class UserDTO {
    user_id:number
   username:string
    password:string
    first_name:string
    last_name:string
    email:string
    role:"Role" // their user permissions
    constructor(
        user_id:number,
        username:string,
        password:string,
        first_name:string,
        last_name:string,
        email:string,
        role:"Role"
        ){  this.user_id = user_id
            this.username = username
            this.password = password
            this.email = email
            this.first_name = first_name
            this.last_name = last_name
            this.role = role
        }
}