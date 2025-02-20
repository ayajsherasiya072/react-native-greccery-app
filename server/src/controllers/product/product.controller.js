
import { Product } from "../../models/product.model";

export const getProductbycategoryId=async (req,reply)=>{
    const {categoryId}=req.params;

    try {
        const product= await Product.find({category:categoryId})
            .select("-category")
            .exec();

        return reply.send(product);
    } catch (error) {
        return reply.status(500).send({message:"an error occured",error})
    }
}