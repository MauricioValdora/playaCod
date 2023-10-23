import express  from "express";
import cookieParser from "cookie-parser";
import handlebars from 'express-handlebars'
import __dirname from "./utils.js";
import session from "express-session";
import FileStore from 'session-file-store'
import MongoStore from "connect-mongo";


const fileStore = FileStore(session)
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Archivos estaticos 
app.use(express.static(`${__dirname}/public`))

//Motor de plantillas
app.engine('handlebars',handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine','handlebars')

app.get('/',(req,res)=>{
    res.render('cookies')
})

app.post('/cookie',(req,res)=>{
    const data = req.body
    res.cookie('LaCookie',data,{maxAge:10000}).send({status:'succes',message:'cookie seteada correctamente'})
})

//persistir secion en archivos
app.use(session({
    store: MongoStore.create({
        mongoUrl:'mongodb+srv://mauricio:valdora@clustermaury.y8wiux9.mongodb.net/ecomerce',
        mongoOptions:{
            useNewUrlParser:true,
            useUnifiedTopology:true
        },
        ttl:60
    }),
    secret:'mauri123',
    resave:true,
    saveUninitialized:true
}))

//persistir secion en mongoose

app.use(session({
    store: new fileStore({
        path:`${__dirname}/sessions`,
        ttl:30,
        retries:0
    }),
    secret:'mauri123',
    resave:true,
    saveUninitialized:true
}))
app.get('/session',(req,res)=>{
    if(req.session.counter){
        req.session.counter++;
        res.send(`se a iniciado el la secion ${req.session.counter} veces`)
    }else{
        req.session.counter=1;
        res.send('bienvenido')
    }
})
app.get('/login',(req,res)=>{
    const {username,pass}=req.query
    if(username!='pepe'||pass!='234'){
        return res.status(401).send('Login fallido')
    }

    req.session.user = username
    req.session.admin = true
    res.send('Login exitoso')
})
//midleware de autenticacion 
function auth(req,res,next){
    if(req.session?.user === 'pepe'&&req.session?.admin===true){
        return next()
    }
    return res.status(403).send('error de permisos')
}
app.get('/private',auth,(req,res)=>{
    res.send('Tienes permisos para estar aca')
})
app.get('/logout',(req,res)=>{
    req.session.destroy(error=>{
        if(!error){
            res.send('session cerrada')
        }else{
            res.send({status:'error',message:error.message})
        }
    })
})




// //todo esto es de cookies primer ejercicio
// //setear cookie parser

// app.use(cookieParser('curioso'))

// //setear una cookie

// app.get('/cookies',(req,res)=>{
//     res.cookie('MauriGalletita','Este es el texto que gaurda la galletita de mauri',{maxAge:30000})
//     .send('alojawai')
// })

// app.get('/all-cookies',(req,res)=>{
//     res.send(req.cookies)
//     console.log(req)
// })

// app.get('/all-signed-cookies',(req,res)=>{
//     res.send(req.signedCookies)
// })

// app.get('/delete-cookie',(req,res)=>{
//     res.clearCookie('MauriGalletita').send('coocie eliminada correctamente')
// })

// app.get('/set-signed-cookie',(req,res)=>{
//     res.cookie('Codersigned','esta cookie esta firmada',{maxAge:30000,signed:true})
//     .send('cookie firmada')
// })

app.listen(8080,()=>{
    console.log('server run')
})