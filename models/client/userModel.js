const mongoose=require ('mongoose')


const userShema=new mongoose.Schema({
  firstName: {
    type: String,
   required: true 
  },
      lastName: {
        type: String,
        required: true,
       
  },
  profilePic: { type: String },
  
      hashPassword: {
        type: String,
   
     
      },
      email: {
        type: String,
        required: true,
        unique: true 
      },
      role: {
        type: String,
        enum: ['ADMIN', 'SELLER', 'CUSTOMER'], 
        default: 'CUSTOMER'
      },
      address:[
        {
          type:mongoose.Schema.Types.ObjectId,
              ref:"Address",
           
        }
      ],
      paymentInformation:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"payment_information"
        }
      ],ratings:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:" rating"
    }
      ],
      reviews:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:" review"
        }
  ]
})
const User=mongoose.model("User",userShema)

module.exports=User;