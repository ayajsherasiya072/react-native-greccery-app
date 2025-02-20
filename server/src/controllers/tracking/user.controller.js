import {Customer, DeliveryPartner} from '../../models/user.model.js'

export const updateUser=async (req,reply)=>{
    try {
        const {userId}=req.user
        const updateData=req.body

        let user=await Customer.findById({userId}) || await DeliveryPartner.findById({userId})

        if(!user)
        {
            return reply.status(404).send({message:"user not found"});
        }

        let userModel;

        if(user.role==="customer")
        {
            userModel=Customer
        }
        else if(user.role==="deliverypartner")
        {
            userModel=DeliveryPartner
        }
        else{
            return reply.status(400).send({message:"invalid user role"});
        }
        const updatedUser=await userModel.findByIdAndUpdate(
            userId,
            {$set:updateData},
            {new:true,runValidators:true}
        );

        if(!updateUser)
        {
            return reply.status(404).send({message:"user not found"});
        }

        return reply.send({
            message:"user updated successfully",
            user:updatedUser
        })

    } catch (error) {
        return reply.status(500).send({message:"failed to update user",error})
    }
}