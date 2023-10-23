import passport from 'passport' 
import GithubStrategy from 'passport-github2'
import userModel from '../models/users.model.js'
import { createHash,isValidPassword } from '../utils.js'


const initializePassport=()=>{
    
    passport.use('github',new GithubStrategy({
        clientID:'Iv1.3090d1b6cc44eea4',
        clientSecret:'68bc8622780b959b9b8e3e22e442bfc8d4717146',
        callbackURL:'http://localhost:8080/api/sessions/github-callback',
        scope:['user:email']
    },async(accessToken,refreshToken,profile,done)=>{
        try {
            console.log(profile)
            const email = profile.emails[0].value

            const user = await userModel.findOne({email})

            if(!user){
                const newUser ={
                    first_name:profile._json.name,
                    last_name:'',
                    age:18,
                    email,
                    password:''
                };

                const result = await userModel.create(newUser)
                return done(null,result)

            }else{
                return done(null,user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        const user = await userModel.findById(id)
        return done(null,user)
    })
}

export default initializePassport