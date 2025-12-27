const express = require("express")
const router = express.Router()
const { getAll, stats, createCategory, getById, updateById, deleteById } = require("../controller/categoryController")

router.get("/count", stats)
router.get("/", getAll)
router.post("/", createCategory)
router.get("/:id", getById)
router.put("/:id", updateById)
router.delete("/:id", deleteById)

module.exports = router