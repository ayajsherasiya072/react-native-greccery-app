import {getAllCategory} from '../controllers/product/category.controller.js'
import {getProductbycategoryId} from '../controllers/product/product.controller.js'

export const categoryRoute=async(fastify,option)=>{
    fastify.get("/getcategory",getAllCategory)
}

export const productRoute=async(fastify,option)=>{
    fastify.get("/getproduct/:categoryId",getProductbycategoryId)
}