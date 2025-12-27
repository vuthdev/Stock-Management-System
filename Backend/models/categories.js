const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            require: true 
        },
        description: { 
            type: String,
        },
    },
    { timestamps: true }
)

const categories = mongoose.model("categories", categorySchema)
module.exports = categories