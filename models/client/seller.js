const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
 name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
     
    },
    hashPassword: {
        type: String, required: true },
    address:
        {
          type:mongoose.Schema.Types.ObjectId,
              ref:"address",
            required: true,
            type: [String],
        }
      ,
      phoneNumber: {
        type: String,
        required:Number
      
      },role: {
        type: String,
        default:"SELLER"
     
      },
    isApproved: {
        type: Boolean,
        default: false 
    },
    product: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    
      }],
     
},
  
{ timestamps: true }, {
  useFindAndModify: false, 
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;