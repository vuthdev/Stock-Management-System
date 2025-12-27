const categories = require("../models/categories")
const Category = require("../models/categories")

exports.getAll = async(req, res) => {
    const category = await categories.find()
    res.json(category)
}

exports.stats = async (req, res) => {
    const category = await categories.countDocuments()
    res.json(category)
}

exports.createCategory = async (req, res) => {
    try {
        const category = await categories(req.body)
        await category.save()
        res.status(201).json(category)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

exports.getById = async (req, res) => {
    try {
        const category = await categories.findById(req.params.id)
        res.status(201).json(category)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateById = async (req, res) => {
    try {
        const category = await categories.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(201).json(category)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const category = await categories.findByIdAndDelete(req.params.id)
        res.status(201).json(category)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    
}