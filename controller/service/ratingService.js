const Rating=require ('../../models/server/ratingModel.js')
const product=require('../../models/server/productModel.js');
const { CreateCart } = require('./cartService');


async function createRating(req,res){
    const product=await product.findProductById(req.productId);

    const rating =new Rating({
        product:product._id,
        user:user._id,
        rating:req.rating,
        CreateAt:new Date()
    })
    return await rating.save();

}

async function getProductRating(productId){
    return await Rating.find({product:productId});
}
module.exports={
    createRating,
    getProductRating
}