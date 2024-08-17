const orderService=require('../service/orderSevice')


const getAllOrders=async(req,res)=>{
    try{
        const orders=await orderService.getAllOrder();
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const confirmOrders=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.confirmOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}
const shippingOrders=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.shipOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const deliverOrders=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.deliveryOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const cancelledOrders=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.CancelledOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}

const deleteOrders=async(req,res)=>{
    const orderId=req.params.orderId;
    try{
        const orders=await orderService.deleteOrder(orderId);
   return res.status(200).send(orders);
    }
    catch(error){
        return res.status(500).send({error:error.message});

    }
}
module.exports={
    getAllOrders,
    confirmOrders,
    cancelledOrders,
    deleteOrders,
    shippingOrders,
    deliverOrders
}