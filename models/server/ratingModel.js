const mongoose=require ('mongoose')


const ratingShema=new mongoose.Schema({
    users:{
        type:mongoose.Schema .Types.ObjectId,
        ref:"User",
        require:true
      },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        require:true
      },
      rating: {
        type: String,
        required: true,
       
       
      },
      createAt:
          {
              type: Date,
              default:Date.now
          }
    })
    const Rating=mongoose.model("rating",ratingShema)

module.exports=Rating;