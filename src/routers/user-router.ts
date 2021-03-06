import * as express from 'express'
import { users } from '../models/users'
import { authenticationAdminMiddleware, authenticationUserMiddleware, authenticationFactory, authenticationCheckId } from '../middleware/authentication-middleware'
import { updateOneUser, findAllUsers, findUserById } from '../services/user-service'
import { UserDTO } from '../dtos/userDTO'


export const userRouter = express.Router()
// this will work almost exactly like it does with userRouter up in index


//generally a get request to the root of a path
//will give you every single one of those resources
userRouter.get('', [authenticationFactory(['finance manager','admin']), async (req,res)=>{
    //get all of our users
    //format them to json
    //use the response obj to send them back
    let users:users[] = await findAllUsers();
    res.json(users)// this will format the object into json and send it back
    
}])

// generally in rest convention
// a post request to the root of a resource will make one new of that resource
userRouter.patch('', authenticationFactory(['admin']), async (req,res)=>{
    let {userId, username, password,
    firstName, lastName, email,
    role}:{
        userId: number,
        username:string,
        password:string,
        firstName:string,
        lastName:string,
        email:string,
        role:"Role"
    } = req.body// this will be where the data the sent me is
    // the downside is this is by default just a string of json, not a js object
    if(userId || username || password || firstName || lastName || email || role){
        
        let updateUser = await updateOneUser(new UserDTO(
                                            userId,
                                            username,
                                            password,
                                            firstName,
                                            lastName,
                                            email,
                                            role
        ))
        // this would be some function for adding a new user to a db
        res.status(201).json(updateUser);// if I don't need to seend a body
    } else {
        res.status(400).send('Please include all user fields')
        // for setting a status and a body
    }

})

// in express we can add a path variable by using a colon in the path
// this will add it to the request object and the colon makes it match anything
userRouter.get('/:userId', authenticationFactory(['finance manager', 'admin', 'user']), authenticationCheckId, async (req,res)=>{
    const id = +req.params.userId// the plus sign is to type coerce into a number
    if(isNaN(id)){
        res.sendStatus(400)
    }else {
        try{
            let user = await findUserById(id)
            res.json(user)
        }catch(e){
            res.status(e.status).send(e.message)
        }
      
        
    }
})