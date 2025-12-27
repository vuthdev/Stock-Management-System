const express = require("express")
const router = express.Router()
const { getOrders, createOrder, countOrder, updateById, getById, deleteById, getMonthlyStats } = require("../controller/orderController")

router.get("/monthly-stats", getMonthlyStats);
router.get("/count", countOrder)
router.get("/", getOrders)
router.post("/", createOrder)
router.get("/:id", getById)
router.put("/:id", updateById)
router.delete("/:id", deleteById)

module.exports = router