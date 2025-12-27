const express = require("express")
const router = express.Router()
const Product = require("../controller/productController")

router.get("/stats", Product.Stats)
router.get("/", Product.getAll)
router.post("/", Product.createProduct)
router.get("/:id", Product.getById)
router.put("/:id", Product.updateById)
router.delete("/:id", Product.deleteById)

module.exports = router;