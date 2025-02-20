import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import fastify from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import {registerRoute} from './src/routes/index.route.js'

dotenv.config();
const start = async () => {

    await connectDB();

    const app = fastify()

    app.register(fastifySocketIO,{
        cors:{
            origin:"*"
        },
        pingInterval:10000,
        pingTimeout:5000,
        transports:['websocket']
    })
    await registerRoute(app)

    app.listen({port:process.env.PORT||3000,host:'0.0.0.0'},(err,addr)=>{
        if (err) {
            console.log("error",err);
        }
        else{
            console.log(
              `Your Grocery App is running on Port:${process.env.PORT || 3000}`
            );
        }
    })

    app.ready().then(()=>{
        app.io.on('connection',(socket)=>{
            console.log("user connected");

            socket.on("joinRoom",(orderId)=>{
                socket.join(orderId)
                console.log(`user joined room ${orderId}`);
                
            })

            socket.on('disconnect',()=>{
                console.log("user disconnected");
                
            })
        })
    })
}
start();
