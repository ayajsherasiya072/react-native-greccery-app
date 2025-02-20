import mongoose from "mongoose";
import { Counter } from "./counter.model";

const orderSchema=new mongoose.Schema({
    orderId:{
        type:String,
        unique:true,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    deliveryPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"DeliveryPartner",
    },
    branch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch",
        required:true
    },
    items:[
        {
            id:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            item:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            count:{
                type:Number,
                required:true
            }
        }
    ],
    deliverylocation:{
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        },
        address:{
            type:String,
        }
    },
    pickuplocation:{
        latitude:{
            type:Number,
            required:true
        },
        longitude:{
            type:Number,
            required:true
        },
        address:{
            type:String,
        }
    },
    deliverypersonlocation:{
        latitude:{
            type:Number,
        },
        longitude:{
            type:Number,
        },
        address:{
            type:String,
        }
    },
    totalprice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['available','conformed','arriving','canceled','delivered'],
        default:"available"
    }


},{timestamps:true})

async function getnextSequenceValue(sequenceName) {
    const sequenceDocument=await Counter.findByIdAndUpdate(
        {name:sequenceName},
        {$inc:{sequence_value:1}},
        {new:true,upsert:true}
    );
    return sequenceDocument.sequence_value;
}

orderSchema.pre("save",async function(next){
    if(this.isNew)
    {
        const sequenceValue=await getnextSequenceValue("orderId");
        this.orderId=`ORDR${sequenceValue.toString().padStart(5,"0")}`;
    }
    next();
})

export const Order=mongoose.model("Order",orderSchema)