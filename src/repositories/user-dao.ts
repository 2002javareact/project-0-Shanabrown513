import { PoolClient } from "pg";
import { connectionPool } from ".";
import { users } from "../models/users";
import { UnauthorizedError} from '../errors/UnauthorizedError'
import { InternalServerError } from "../errors/InternalServerError";
import { userDTOToUserConverter } from '../util/user-dto-to-user-converter';
import { UserDTO } from "../dtos/userDTO";
import { UserNotFoundError } from "../errors/UserNotFoundError";


export async function daoFindUserByUsernameAndPassword(username:string,password:string):Promise<users>{
    let client:PoolClient// our potential connection to db
    try {
        client = await connectionPool.connect()
        // a paramaterized query
        let results = await client.query('SELECT * FROM "project_0"."users" U inner join "project_0"."roles" R on U."role" = R.role_id  WHERE username = $1  and "password" = $2', [username,password])
        if(results.rowCount === 0){
            throw new Error('User Not Found')
        }
        return userDTOToUserConverter(results.rows[0])
    } catch(e){
        console.log(e);
        if(e.message === 'User Not Found'){
            throw new UserNotFoundError()
        }else {
            throw new InternalServerError()
        }
    } finally {
        client && client.release()
    }
}



// this function gets anf formats all users
export async function daoFindAllUsers():Promise<users[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query('select * from "project_0"."users" u inner join "project_0"."roles" r on u."role" = r.role_id')
        return results.rows.map(userDTOToUserConverter)

    }catch(e){
        throw new InternalServerError()
    } finally {
        client && client.release()
    }

}


// function that saves a new user and returns that user with its new id
export async function daoSaveOneUser(newUser:UserDTO):Promise<users> {
    let client:PoolClient
    try { 
        client = await connectionPool.connect()
        // send a query and immeadiately get the role id matching the name on the dto
        let roleId = (await client.query('SELECT * FROM "project_0"."roles" WHERE role_name = $1', [newUser.role])).rows[0].role_id
        // send an insert that uses the id above and the user input
        let result = await client.query('INSERT INTO "project_0"."users" (user_id, username, "password", first_name, last_name, email, f, "Roles") values ($1,$2,$3,$4,$5,$6,$7) RETURNING user_id;',
        [newUser.user_id,newUser.username, newUser.password, newUser.first_name, newUser.last_name,  newUser.email, roleId])
        // put that newly genertaed user_id on the DTO 
        newUser.user_id = result.rows[0].user_id
        return userDTOToUserConverter(newUser)// convert and send back
    } catch(e){

        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}


export async function daoFindUserById(id:number):Promise<users>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('SELECT * FROM "project_0"."users" U inner join "project_0".roles R on U."role" = R.role_id WHERE U.user_id =$1', [id])
        if(result.rowCount === 0){
            throw new Error('User Not Found')
        }
        return userDTOToUserConverter(result.rows[0])

    }catch(e){
        // id DNE
        //need if for that
        if(e.message ==='User Not Found'){
            throw new UserNotFoundError()
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}

