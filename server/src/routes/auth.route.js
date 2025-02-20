import{
    fetchUser,
    loginCustomer,
    loginDeliveryPartner,
    refreshToken
} from '../controllers/auth/auth.controller.js'

import {updateUser} from '../controllers/tracking/user.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'

export const authRoute=async(fastify,option)=>{
    fastify.post("/customer/login",loginCustomer)
    fastify.post("/delivery/login",loginDeliveryPartner)
    fastify.post("/refresh-token",refreshToken)
    fastify.get("/getuser",{preHandler:[verifyToken]},fetchUser)
    fastify.patch("/updateuser",{preHandler:[verifyToken]},updateUser)
}