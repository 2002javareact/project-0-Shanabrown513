import * as express from 'express'
import { reimbursement } from '../models/reimbursement'
import { authenticationAdminMiddleware, authenticationUserMiddleware, authenticationFactory, authenticationCheckId } from '../middleware/authentication-middleware'
import { updateOneReimbursement, findReimbursementById, findReimbursementByStatusId, saveOneReimbursement} from '../services/reimbursement-service'
import { reimbursementDTO } from '../dtos/reimbursementDTO'

export const reimbursementRouter = express.Router()
// this will work almost exactly like it does with userRouter up in index

/*
//generally a get request to the root of a path
//will give you every single one of those resources
reimbursementRouter.get('', [authenticationFactory(['finance manager', 'admin']), async (req,res)=>{
    //get all of our reimbursement
    //format them to json
    //use the response obj to send them back
    let reimbursement:reimbursement[] = await findAllReimbursement(); 
    res.json(reimbursement)// this will format the object into json and send it back
    
}])
*/

// generally in rest convention
// a post request to the root of a resource will make one new of that resource
 reimbursementRouter.post('', authenticationFactory(['Everyone']), async (req,res)=>{
     let {reimbursementId,
        author, amount, 
         dateSubmitted, dateResolved, 
         description, resolver, status, type 
     }:{
         reimbursementId:number,
         author:number,
         amount:number,
         dateSubmitted:number, 
         dateResolved:number, 
         description:string,
         resolver:number, 
         status:number, 
         type:number
     } = req.body
         // this will be where the data the sent me is
     // the downside is this is by default just a string of json, not a js object
     if(reimbursementId && author && amount &&
         dateSubmitted && dateResolved && 
         description && resolver && status && type){
             let newReimbursement = await saveOneReimbursement(new reimbursementDTO( 
                                                                reimbursementId,
                                                                author, 
                                                                amount, 
                                                                dateSubmitted, 
                                                                dateResolved, 
                                                                description, 
                                                                resolver,
                                                                status, 
                                                                type 
 ))
         res.status(201).json(newReimbursement);// if I don't need to seend a body
     } else { console.log(reimbursementId);
         res.status(400).send('Please include all reimbursement fields')
         // for setting a status and a body
     }

 })

 reimbursementRouter.patch('/', authenticationFactory(['admin','finance manager']), async (req,res)=>{
    let {reimbursementId,
        author, amount, 
         dateSubmitted, dateResolved, 
         description, resolver, status, type}:{
        reimbursementId:number,
        author:number,
        amount:number,
        dateSubmitted:number, 
        dateResolved:number, 
        description:string,
        resolver:number, 
        status:number, 
        type:number
    } = req.body// this will be where the data the sent me is
    // the downside is this is by default just a string of json, not a js object
    if(reimbursementId && (author || amount || dateSubmitted || dateResolved || description || resolver || status || type)){
        let updateReimbursement = await updateOneReimbursement(new reimbursementDTO(
                                                                reimbursementId,
                                                                author, 
                                                                amount, 
                                                                dateSubmitted, 
                                                                dateResolved, 
                                                                description, 
                                                                resolver,
                                                                status, 
                                                                type 
        ))
        // this would be some function for adding a new user to a db
        res.status(201).json(updateReimbursement);// if I don't need to seend a body
    } else {
        res.status(400).send('Please include all reimbursement fields')
        // for setting a status and a body
    }

})


reimbursementRouter.get('/author/userId/:userId', authenticationFactory(['admin', 'finance manager', 'user']), authenticationCheckId, async (req,res)=>{
    const id = +req.params.userId// the plus sign is to type coerce into a number
    if(isNaN(id)){
        res.sendStatus(400)
    }else {
        try{
            let reimbursement = await findReimbursementById(id)
            res.json(reimbursement)
        }catch(e){
            res.status(e.status).send(e.message)
        }
      
        
    }
})
reimbursementRouter.get('/status/:statusId', authenticationFactory(['admin', 'finance manager']), async (req,res)=>{
    const stat = +req.params.statusId// the plus sign is to type coerce into a number
    if(isNaN(stat)){
        res.sendStatus(400)
    }else {
        try{
            let reimbursement = await findReimbursementByStatusId(stat)
            res.json(reimbursement)
        }catch(e){
            res.status(e.status).send(e.message)
        }
    }
})
