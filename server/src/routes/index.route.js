import { authRoute } from "./auth.route.js";
import { orderRoute } from "./order.route.js";
import { categoryRoute,productRoute } from "./product.route.js";

const prefix="/api/v1"

export const registerRoute=async(fastify)=>{
    fastify.register(authRoute,{prefix:prefix})
    fastify.register(productRoute,{prefix:prefix})
    fastify.register(categoryRoute,{prefix:prefix})
    fastify.register(orderRoute,{prefix:prefix})
}