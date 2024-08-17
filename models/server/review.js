const mongoose=require ('mongoose')



const reviwShema=new mongoose.Schema({
  
    review:{
        type: String,
        require:true
      },
      product: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        require:true
      },
      user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
      },
      createAd:{
        type:Date,
        required:Date.now,
      },
    })
    
const Review=mongoose.model("review",reviwShema)

module.exports=Review;