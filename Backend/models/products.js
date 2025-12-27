const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
      name: { 
        type: String, 
        require: true
      },
      description: { 
        type: String
      },
      category_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "categories", 
        require: true 
      },
      stock: {
        type: Number,
        require: true 
      },
      price: {
        type: Number, 
        require: true 
      },
  },
  { timestamps: true })

const product = mongoose.model("products", productSchema)
module.exports = product;