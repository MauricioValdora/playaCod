import express  from "express";
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import viewsRouter from './routes/views.router.js'
import sessionRouter from './routes/sessions.router.js'
import mongoose from "mongoose";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express()
try {
    await mongoose.connect('mongodb+srv://mauricio:valdora@clustermaury.y8wiux9.mongodb.net/ecomerce')
    console.log('base conectada')
} catch (error) {
    console.log(error.message)
}

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Archivos estaticos 
app.use(express.static(`${__dirname}/public`))

//Motor de plantillas
app.engine('handlebars',handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine','handlebars')



//persistir secion en archivos
app.use(session({
    store: MongoStore.create({
       client:mongoose.connection.getClient(),
        ttl:3600
    }),
    secret:'mauri123',
    resave:true,
    saveUninitialized:true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/',viewsRouter)
app.use('/api/sessions',sessionRouter)
app.listen(8080,()=>{
    console.log('server run')
})