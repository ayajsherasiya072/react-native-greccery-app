import{
    createOrder,
    conformOrder,
    updateOrderStatus,
    getOrders,
    getOrderByid
} from '../controllers/order/order.controller.js'

import { verifyToken } from '../middleware/auth.middleware.js'

export const orderRoute=async(fastify,option)=>{
    fastify.addHook("preHandler",async(Request,reply)=>{
        const isAuthenticated=await verifyToken(request,reply);
        if(!isAuthenticated){
            return reply.code(401).send({message:"Unauthorized"})
        }
    });
    fastify.post("/create-order",createOrder)
    fastify.get("/get-order",getOrders)
    fastify.patch("/update-order-status/:orderId",updateOrderStatus)
    fastify.post("/order-conformed/:orderId",conformOrder)
    fastify.get("/get-orderbyid/:orderId",getOrderByid)
}