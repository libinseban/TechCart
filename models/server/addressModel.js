const mongoose=require('mongoose')

const AddressShema=new mongoose.Schema({


    firstName: {
        type: String,
        required: true,
       
      },
      lastName: {
        type: String,
        required: true,
       
      },
      streetAddress: {
        type: String,
        required: true,
       
      },
      city: {
        type: String,
        required: true,
       
      },
      state: {
        type: String,
        required: true,
       
      },
     
       
      zipCode: {
        type: String,
        required: true,
       
      },
      
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
      },
  phoneNumber: { type: Number, required: true },
      
},{
  timestamps: true
})
const Address=mongoose.model("Address",AddressShema);

module.exports=Address;