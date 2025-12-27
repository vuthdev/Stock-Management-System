const express = require("express")
const mongoose = require("mongoose")
const productRoutes = require("./routes/productsRoutes")
const categoriesRotue = require("./routes/categoriesRoutes")
const usersRoute = require("./routes/usersRoutes")
const ordersRoute = require("./routes/ordersRoutes")
const cors = require("cors")
const jwt = require("jsonwebtoken")
const path = require('path');
const dotenv = require("dotenv")
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Mongo error:", err));

app.use("/api/products", productRoutes)
app.use("/api/categories", categoriesRotue)
app.use("/api/users", usersRoute)
app.use("/api/orders", ordersRoute)

app.listen(process.env.PORT, () => console.log("Server running on http://localhost:3000"))