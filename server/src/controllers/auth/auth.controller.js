import {Admin, Customer,DeliveryPartner} from '../../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateToken=(user)=>{
    const accessToken=jwt.sign(
        {userId:user._id,role:user.role},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
    );
    const refreshToken=jwt.sign(
        {userId:user._id,role:user.role},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:"7d"}
    );

    return {accessToken,refreshToken};
}


export const loginCustomer=async(req,reply)=>{
    try {
        const {phone}=req.body

        if(!phone)
        {
            return reply.status(404).send({message:"phone number is required"});
        }

        let customer=await Customer.findOne({phone});

        if(!customer)
        {
            customer=new Customer({
                phone,
                role:"customer",
                isActivated:true
            });
                await customer.save()
        }

        const {accessToken,refreshToken}=generateToken(customer);

        return reply.send({
            message: customer ? "Login Successfully":"Customer created and logged in successfully" ,
            accessToken,
            refreshToken,
            customer
        })
    } catch (error) {
        return reply.status(500).send({message:"an error occured",error});
    }
}

export const loginDeliveryPartner=async(req,reply)=>{
    try {
        const {email,password}=req.body

        if(!email || !password)
        {
            return reply.status(404).send({message:"email and password are required"});
        }

        const deliverypartner=DeliveryPartner.findOne({email});
        
        if(!deliverypartner)
        {
            return reply.status(404).send({message:"Delivery Partner not found"});
        }

        const isMatch=password ===deliverypartner.password

        if(!isMatch)
        {
            return reply.status(401).send({message:"Invalid Password"});
        }

        const {accessToken,refreshToken}=generateToken(deliverypartner)

        return reply.send({
            message: "Login Successfully",
            accessToken,
            refreshToken,
            deliverypartner
        })
    } catch (error) {
        return reply.status(500).send({message:"an error occured",error});
    }
}

export const refreshToken=async(req,reply)=>{
    const {refreshToken}=req.body

    if(!refreshToken)
    {
        return reply.status(404).send({message:"refresh token is required"});
    }

    try {
        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        let user;
        if(decoded.role==="deliverypartner"){
            user=await DeliveryPartner.findById(decoded.userId);
        }
        else if(decoded.role==="customer"){
            user=await Customer.findById(decoded.userId);
        }
        else if(decoded.role==="admin"){
            user=await Admin.findById(decoded.userId);
        }
        else{
            return reply.status(401).send({message:"Invalid Role"});
        }

        if(!user)
        {
            return reply.status(404).send({message:"User not found"});
        }

        const {accessToken,refreshToken:newrefreshToken}=generateToken(user)

        return reply.send({
            message: "RefreshToken refreshed Successfully",
            accessToken,
            refreshToken:newrefreshToken
        })
    } catch (error) {
        return reply.status(500).send({message:"invalid refresh token",error});
    }
}

export const fetchUser=async(req,reply)=>{
    try {
        const {userId,role}=req.user

        let user;
        if(role==="deliverypartner"){
            user=await DeliveryPartner.findById(userId);
        }
        else if(role==="customer"){
            user=await Customer.findById(userId);
        }
        else{
            return reply.status(401).send({message:"Invalid Role"});
        }
        if(!user)
        {
            return reply.status(404).send({message:"User not found"});
        }

        return reply.send({
            message: "User fetched Successfully",
            user
        });
    } catch (error) {
        return reply.status(500).send({message:"an error occured",error});
    }
}