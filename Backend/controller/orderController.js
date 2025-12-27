const Orders = require("../models/orders")
const Products = require("../models/products")

exports.getOrders = async (req, res) => {
    const order = await Orders.find().populate("userId").populate("productId")
    res.json(order)
}

exports.createOrder = async (req, res) => {
  try {
    const product = await Products.findById(req.body.productId)
    if(!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    if(product.stock < req.body.quantity) {
      return res.status(404).json({ message: "Not enough stock" })
    }

    req.body.totalPrice = product.price * req.body.quantity

    const order = await Orders(req.body)
    await order.save()
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.mesesage })
  }
}

exports.getById = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id).populate("userId").populate("productId")
        res.status(201).json(order)
    } catch (err) {
        res.status(404).json({ messange: err.mesesage })
    }
}

exports.updateById = async (req, res) => {
    try {
      const product = await Products.findById(req.body.productId)
      if (req.body.quantity) {
        req.body.totalPrice = product.price * req.body.quantity
      }
      const order = await Orders.findByIdAndUpdate(req.params.id, req.body, { new: true})
      res.status(201).json(order)
    } catch (err) {
      res.status(500).json({ messange: err.messange })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const order = await Orders.findByIdAndDelete(req.params.id)
        res.status(201).json(order)
    } catch (err) {
        res.status(500).json({ messange: err.messange })
    }
}

exports.countOrder = async (req, res) => {
    try {
        const order = await Orders.countDocuments()
        res.status(201).json(order)
    } catch (err) {
        res.status(500).json({ mesesage: err.messange })
    }
}

exports.getMonthlyStats = async (req, res) => {
  try {
    const stats = await Orders.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formatted = stats.map(item => ({
      month: monthNames[item._id - 1],
      total: item.total
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};