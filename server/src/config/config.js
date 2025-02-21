import 'dotenv/config'
import fastifySession from '@fastify/session'
import ConnectMongoDBSession from 'connect-mongodb-session'
import {Admin} from '../models/user.model.js'

export const PORT=process.env.PORT || 3000
export const COOKIE_PASSWORD=process.env.COOKIE_PASSWORD

const MongoDBStore=ConnectMongoDBSession(fastifySession)

export const sessionStore=new MongoDBStore({
    uri:process.env.MONGO_URL,
    collection:"sessions"
})


sessionStore.on('error',(error)=>{
    console.log("session store error",error);
    
})

export const authenticate=async(email,passsword)=>{
    if(email && passsword)
    {
       
        if(email=="bhandari@gnail.com" && passsword=="1234")
        {
            return Promise.resolve({email:email,passsword:passsword})
        }
        else{
            return null
        }
    }
}

