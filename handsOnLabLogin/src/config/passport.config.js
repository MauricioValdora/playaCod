import passport from 'passport' 
import local from 'passport-local'
import userModel from '../models/users.model.js'
import { createHash,isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport=()=>{
    passport.use('register',new LocalStrategy({
        passReqToCallback:true,
        usernameField:'email'
    },async(req,username,password,done)=>{
        try {
            const {first_name,last_name,age}=req.body
            console.log(first_name,last_name,age)
            const exist = await userModel.findOne({email:username});
            console.log(exist)
            if(exist){
                return done(null,false)
            }
           const result= await userModel.create({
                first_name,
                last_name,
                email:username,
                password:createHash(password),
                age
            })

            return done(null,result)
    
        } catch (error) {
            return done(`error al registrar el usuario ${error.message}`)
        }
    }))

    passport.use('login',new LocalStrategy({
        passReqToCallback:true,
        usernameField:'email'
    },async(username,password,done)=>{
        try {
            const user = await userModel.findOne({email})
            if(!user){
                return done(null,false)
            }
            if(!isValidPassword(password,user.password)){
                return done(null,false)
            }
            req.session.user={
                name:`${user.first_name} ${user.last_name}`,
                email:user.email,
                age:user.age
            }
            return done(null,user)
        } catch (error) {
        return done(null,false)
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        const user = await userModel.findById(id)
        return done(`error al loguear el usuario ${error.message}`)
    })
}

export default initializePassport