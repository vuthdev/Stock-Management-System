const express = require("express")
const route = express.Router()
const upload = require("../middleware/upload")
const { getUsers, createUser, deleteUser, updateUser, getUserById, getCount } = require("../controller/userController")

route.get("/count", getCount)
route.get("/", getUsers)
route.post("/", upload.single("image"),createUser)
route.get("/:id", getUserById)
route.delete("/:id", deleteUser)
route.put("/:id", updateUser)

module.exports = route