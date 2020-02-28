// big rule, always call either res or next

export const authenticationAdminMiddleware = (req,res,next)=>{
    if(!req.session.user){
        res.status(400).send('Invalid Cradentials')
    }else if(req.session.user.role === 'admin'){
        next()
    } else {
        res.status(401).send('The incoming token has expired')
    }
    
} 

export const authenticationFinanceManagerMiddleware = (req,res,next)=>{
    if(!req.session.user){
        res.status(401).send('Invalid Cradentials')
    }else if(req.session.user.role === 'Finance Manager' || req.session.user.role === 'admin'){
        next()
    } else {
        res.status(401).send('The incoming token has expired')
    }
    
} 
export const authenticationUserMiddleware = (req,res,next) => {
    if(!req.session.user){
        res.status(401).send('Invalid Cradentials')
    }else if(req.session.user.role === 'Admin' || req.session.user.role === 'Finance Advisor'|| req.session.user.id === +req.params.id ){
        next()
    } else {
        res.status(401).send('The incoming token has expired')
    }
}
// I give it a variable config input
// it gives me a function
export const authenticationFactory = (roles:string[]) => {
    return (req,res,next) => {
        // this checks that you are logged in
        if(!req.session.user){
            res.status(401).send('Invalid Cradentials')
        // is there is the special role Everyone, allow them in
        } else if(roles.includes('Everyone')){
            next()
        } else {
            let allowed = false
            // loop through all of the allowed roles
            for(let role of roles){
                // see if user has a matching role
                if(req.session.user.role === role){
                    allowed = true
                    next()
                }
            }
            if(!allowed){
                res.status(401).send('The incoming token has expired')
            }
            
        }
    }
}

// match user id to path param id
export const authenticationCheckId= (req,res,next) => {
    if(req.session.user.role === 'admin'){
        next()
    } else if(req.session.user.role === 'finance manager'){  
        next()
    } else if(req.session.user.userId === +req.params.userId ){
        next()
    } else {;
        res.status(401).send('The incoming token has expired')
    }
}
