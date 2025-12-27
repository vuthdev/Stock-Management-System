const Product = require('../models/products')
const Orders = require('../models/orders')

exports.Stats = async (req , res) => {
    try {
        const total = await Product.countDocuments();
        const instock = await Product.countDocuments({ instock: true });
        const lastMonth = await Product.countDocuments({ 
            create_date: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
        })
        const outofstock = total - instock;
        const change = total - lastMonth

        let trend = "none"
        if (change > 0) trend = "up"
        if (change < 0) trend = "down"

        const percent = lastMonth === 0 ? 100 : Math.abs(change / lastMonth * 100).toFixed(1);

        res.json({
            total,
            instock,
            outofstock,
            change: Number(percent),
            trend,
            period: "from last month"
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getAll = async (req, res) => {
    const getAllProducts = await Product.find().populate('category_id', 'name')
    res.json(getAllProducts)
}

exports.createProduct = async (req, res) => {
    const products = await Product(req.body)
    await products.save()
    res.json(products)
}

exports.getById = async (req, res) => {
    const getProduct = await Product.findById(req.params.id)
    res.json(getProduct)
}

exports.updateById = async (req, res) => {
    try {
        const productUpdate = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

        if (req.body.price) {
            await Orders.updateMany(
                { productId: req.params.id },
                [
                    {
                        $set: { totalPrice: { $multiply: ["$quantity", req.body.price]} }
                    }
                ]
            )
        }
        
        res.status(201).json(productUpdate)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    
}

exports.deleteById = async (req, res) => {
    try {
        const productDelete = await Product.findByIdAndDelete(req.params.id)
        res.status(201).json(productDelete)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}