const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        require: true 
    },
    email: { 
        type: String, 
        require: true 
    },
    password: { 
        type: Number, 
        require: true 
    },
    gender: { 
        type: String, 
        enum: ["Male", "Female"], 
        require: true 
    },
    image: {
        type: String
    }
})

const user = mongoose.model("users", userSchema)
module.exports = user