import mongoose from "mongoose";

const branchSChema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    location:{
        latitude:{
            type:Number,
        },
        longitude:{
            type:Number,
        }
    },
    address:{
        type:String
    },
    deliveryPartners:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"DeliveryPartner"
        }
    ]
},{timestamps:true})

export const Branch=mongoose.model("Branch",branchSChema)