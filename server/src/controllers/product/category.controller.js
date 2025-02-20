import {Category} from '../../models/category.model.js';

export const getAllCategory=async (req,reply)=>{
    try {
        const category=await Category.find()

        return reply.send(category);
        
    } catch (error) {
        return reply.status(500).send({message:"an error occured",error})
    }
}