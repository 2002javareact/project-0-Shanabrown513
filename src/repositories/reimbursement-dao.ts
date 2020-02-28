import { PoolClient } from "pg";
import { connectionPool } from ".";
import { reimbursement } from "../models/reimbursement";
import { UnauthorizedError} from '../errors/UnauthorizedError'
import { InternalServerError } from "../errors/InternalServerError";
import { reimbursementDTOToReimbursementConverter } from '../util/reimbursement-dto-to-reimbursement-converter';
import { reimbursementDTO } from "../dtos/reimbursementDTO";
import { reimbursementNotFoundError } from "../errors/reimbursementNotFoundError"; 


 /*export async function daoFindreimbursementByreimbursementnameAndPassword(reimbursementname:string,password:string):Promise<reimbursement>{
    let client:PoolClient// our potential connection to db
    try {
        client = await connectionPool.connect()
        // a paramaterized query
        let results = await client.query('SELECT * FROM "project_0"."reimbursement" U inner join "Project_0"."roles" R on U."role" = R.role_id  WHERE reimbursementname = $1  and "password" = $2', [reimbursementname,password])
        if(results.rowCount === 0){
            throw new Error('reimbursement Not Found')
        }
        return reimbursementDTOToreimbursementConverter(results.rows[0])
    } catch(e){
        console.log(e);
        if(e.message === 'reimbursement Not Found'){
            throw new UnauthorizedError()
        }else {
            throw new InternalServerError()
        }
    } finally {
        client && client.release()
    }
}



// this function gets anf formats all reimbursements
export async function daoFindAllReimbursement():Promise<reimbursement[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let results = await client.query('select * from "Project_0"."reimbursement" R inner join Project_0".reimbursement.type on "Project-0".reimbursement_type = rt.type_id')
        return results.rows.map(reimbursementDTOToReimbursementConverter)

    }catch(e){
        throw new InternalServerError()
    } finally {
        client && client.release()
    }

}
*/

// function that saves a new reimbursement and returns that reimbursement with its new id


export async function daoSaveOneReimbursement(newReimbursement:reimbursementDTO):Promise<reimbursement> {
    let client:PoolClient
    try { 
        client = await connectionPool.connect()
        // send a query and immeadiately get the role id matching the name on the dto
        let reimbursementId = (await client.query('SELECT * FROM project_0.rembursement WHERE reimbursement_id = $1', [newReimbursement.reimbursement_id])).rows[0].reimbursement_id
        // send an insert that uses the id above and the reimbursement input
        let result = await client.query('INSERT INTO project_0.reimbursement (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [newReimbursement.reimbursement_id, newReimbursement.author, newReimbursement.amount, newReimbursement.date_submitted, newReimbursement.date_resolved, newReimbursement.description, newReimbursement.resolver, newReimbursement.status, newReimbursement.type])
        // put that newly genertaed reimbursement_id on the DTO 
        newReimbursement.reimbursement_id = result.rows[0].reimbursement_id
        return reimbursementDTOToReimbursementConverter(newReimbursement)// convert and send back
    } catch(e){

        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}


export async function daoFindReimbursementById(id:number):Promise<reimbursement>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('select * from project_0.reimbursement where reimbursement.author = $1', [id])
        if(result.rowCount === 0){
            throw new Error('reimbursement Not Found')
        }
        return reimbursementDTOToReimbursementConverter(result.rows[0])

    }catch(e){
        // id DNE
        //need if for thatdx'
        if(e.message ==='reimbursement Not Found'){
            throw new reimbursementNotFoundError()
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}


export async function daoFindReimbursementByStatusId(stat:number):Promise<reimbursement[]>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        let result = await client.query('select * from project_0.reimbursement where reimbursement.status = $1', [stat])
        if(result.rowCount === 0){
            throw new Error('reimbursement Not Found')
        }
        return result.rows.map(reimbursementDTOToReimbursementConverter)

    }catch(e){
        // id DNE
        //need if for thatdx
        if(e.message ==='reimbursement Not Found'){
            throw new reimbursementNotFoundError()
        }
        throw new InternalServerError()
    } finally {
        client && client.release()
    }
}
