const mongoose = require("mongoose")

const orderSchema = mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        orderDate: {
            type: Date,
            default: Date.now()
        }
    },
    { timestamps: true }
)

const order = mongoose.model("orders", orderSchema)
module.exports = order