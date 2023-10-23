import {Router} from 'express'
import { authToken,generateToken } from '../utils.js'
import passport from 'passport'

const router = Router()

const users =[
    {
        name:'prueba',
        email:'prueba@gmail.com',
        password:'123'
    }
]

router.post('/register',async(req,res)=>{
    try {
        const {name,email,password} =req.body

        const exists = users.find(user=>user.email===email)

        if(exists) return res.status(400).send({status:'error',message:'el ususario ya existe wn'})

        const user =   {
            name,
            email,
            password
        }
        users.push(user)

        const accessToken = generateToken(user)

        
        res.cookie('codertoken',accessToken,{maxAge:60*60*1000,httpOnly:true}).send({status:'succes'})

    } catch (error) {
        res.status(500).send({status:'error',message:error.message})
    }
})
router.post('/login',async(req,res)=>{
    try {
        const {email,password} =req.body

        const user = users.find(user=>user.email===email&&user.password===password)

        if(!user)return res.status(401).send({status:'error',message:'ivalid credentials'})



        const accessToken = generateToken(user)
        // res.send({status:'success',access_token:accessToken})
        res.cookie('codertoken',accessToken,{maxAge:60*60*1000,httpOnly:true}).send({status:'succes'})


    } catch (error) {
        res.status(500).send({status:'error',message:error.message})
    }
})

router.get('/private',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.send({status:'success',payload:req.user})
})

export default router