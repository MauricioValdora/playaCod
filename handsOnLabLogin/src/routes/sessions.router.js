import {Router} from 'express'
import userModel from '../models/users.model.js'
import { createHash,isValidPassword } from '../utils.js'
import passport from 'passport'

const router = Router()

router.post('/register',passport.authenticate('register',{failureRedirect:'fail-register'}),async(req,res)=>{
    res.send({status:'success',message:'user register'})
    req.session.user={
        name:`${first_name} ${last_name}`,
        email:email,
        age:age
    }
  
})

router.get('/fail-register',async(req,res)=>{
    res.status(500).send({status:'error',message:'register fail'})
})

router.post('/login',passport.authenticate('login',{failureRedirect:'fail-login'}),async(req,res)=>{
   if(!req.user){
    return res.status(401).send({status:'error',message:'incorrect credentialas'})
   }
   req.session.user={
    name:`${req.user.first_name} ${req._constructuser.last_name}`,
    email:req.user.email,
    age:req.user.age
}
res.send({statuss:'ok'})
})
router.get('/fail-login',async(req,res)=>{
    res.status(500).send({status:'error',message:'login fail'})
})
router.get('/logout',(req,res)=>{
    req.session.destroy(error=>{
        if(error)return res.status(500).send({status:'error',error:'fail'})
        res.redirect('/register')
    })
})

export default router;