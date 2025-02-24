import {Customer,DeliveryPartner} from '../../models/user.model.js'
import {Order} from '../../models/order.model.js'
import {Branch} from '../../models/branch.model.js'

export const createOrder=async(req,reply)=>{
    try {
        const {userId}=req.user
        const {items,branch,totalPrice}=req.body
        
        const customerData=await Customer.findById(userId)
        const branchData=await Branch.findById(branch)

        if(!customerData)
        {
            return reply.status(404).send({message:"customer not found"})
        }

        const newOrder=new Order({
            customer:userId,
            id:item.id,
            branch,
            items:items.map((item)=>({
                id:item.id,
                item:item.item,
                count:item.count
            })),
            branch,
            totalprice,
            deliverylocation:{
                latitude:customerData.livelocation.latitude,
                longitude:customerData.livelocation.latitude,
                address:customerData.address || "no address available"
            },
            pickuplocation:{
                latitude:branchData.location.latitude,
                longitude:branchData.location.latitude,
                address:branchData.address || "no address available"
            }
        })

        const saveOrder=new newOrder.save()

        return reply.send({
            message:"order created successfully",
            saveOrder
        })

        
    } catch (error) {
        return reply.status(500).send({message:"failed to create order",error})
    }
}

export const conformOrder=async (req,reply)=>{
    try {
        const {orderId}=req.params
        const {userId}=req.user
        const {deliverypersonlocation}=req.body

        const deliveryPerson=await DeliveryPartner.findById(userId)

        if(!deliveryPerson)
        {
            return reply.status(404).send({message:"delivery person not found"})
        }
        const order=await Order.findById(orderId)

        if(!order){
            return reply.status(404).send({message:"order not found"})
        }
        if(order.status!=="available"){
            return reply.status(400).send({message:"order not available for confirmation"})
        }
        order.status="conformed"
        order.deliveryPartner=userId
        order.deliverypersonlocation={
            latitude:deliverypersonlocation?.latitude,
            longitude:deliverypersonlocation?.longitude,
            address:deliverypersonlocation.address || "no address available"
        }

        req.server.io.to(orderId).emit('orderConformed',order)

        await order.save()

        return reply.send({
            message:"order conformed successfully",
            order
        })

    } catch (error) {
        return reply.status(500).send({message:"failed to conform order",error})
    }
}

export const updateOrderStatus=async(req,reply)=>{

    try {
        const {orderId}=req.params
        const {status,deliverypersonlocation}=req.body
        const {userId}=req.user

        const deliveryPerson=await DeliveryPartner.findById(userId)
        if(!deliveryPerson){
            return reply.status(404).send({message:"delivery person not found"})
        }

        const order=await Order.findById(orderId)
        if(!order)
        {
            return reply.status(404).send({message:"order not found"})
        }

        if(["canceled","delivered"].includes(order.status))
        {
            return reply.status(400).send({message:"order cannot be updated"})
        }

        if(order.deliveryPartner.toString() !==userId)
        {
            return reply.status(403).send({message:"unauthorized"})
        }
        order.status=status
        order.deliverypersonlocation=deliverypersonlocation
        await order.save()

        req.server.io.to(orderId).emit("livetrackingUpdates",order);

        return reply.send({
            message:"order updated successfully",
            order
        })
    } catch (error) {
        return reply.status(500).send({message:"failed to update order status",error})
    }
}

export const getOrders=async(req,reply)=>{
    try {
        const {status,customerId,deliveryPartnerId,branchId}=req.query
        let query={}

        if(status)
        {
            query.status=status
        }
        if(customerId)
        {
            query.customer=customerId
        }
        if(deliveryPartnerId)
        {
            query.deliveryPartner=deliveryPartnerId
            query.branch=branchId
        }
        const orders=await Order.find(query).populate("customer branch item.item deliveryPartner")

        return reply.send({
            message:"orders retrieved successfully",
            orders
        })
        
    } catch (error) {
        return reply.status(500).send({message:"failed to get orders",error})
    }
                    
}

export const getOrderByid=async(req,reply)=>{
    try {
        const {orderId}=req.params
        const order=await Order.findById(orderId).populate("customer branch item.item deliveryPartner")

        if(!order)
        {
            return reply.status(404).send({message:"order not found",error})
        }
        return reply.send({
            message:"order retrieved id successfully",
            order
        })
    } catch (error) {
        return reply.status(500).send({message:"failed to get order by id",error})
    }
}