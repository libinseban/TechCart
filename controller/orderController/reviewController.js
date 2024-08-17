const ReviewServices=require("../service/reviewService")


const createReview  =async(req,res)=>{
    const  user=req.user;
    try
    {
   const review=await ReviewServices.createReview(req.body.review);
   return res.status(201).send(review);
    }
    catch(error){
        return res.status(500).send({error:error.message});
    }

}
const getAllReview  =async(req,res)=>{
    const productId=req.params.productId;
    const  user=req.user;
    try
    {
   const review=await ReviewServices.getAllReview(productId);
   return res.status(201).send(review);
    }
    catch(error){
        return res.status(500).send({error:error.message});
    }

}
module.exports={
    getAllReview,
    createReview
}


