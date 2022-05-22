const Order = require("../models/orderModel");
const orderItems = require("../models/orderItemModel");
const orderCtrl = {
  orderList: async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createOrder: async (req, res) => {
    try {
    const orderItemId=Promise.all( req.body.orderItem.map(async(orderItem)=>{
        const {quantity,product} = orderItem
        let newOrderItem = new orderItems( { quantity,product });
        newOrderItem=await newOrderItem.save()
        return newOrderItem._id
    }))
    const newOrderItems=await orderItemId;
    const totalPrices=await Promise.all(newOrderItems.map(async(newOrderItem)=>{
        const orderItem= await orderItems.findById(newOrderItem).populate("product","price");
        const totalPrice=orderItem.product.price *orderItem.quantity
        return totalPrice
    }))
    const totalPrice=totalPrices.reduce((a, b) => a+b,0)
    const { shippingAddress1,shippingAddress2,city,zip,country,phone,status } = req.body;
    const neworder = new Order( { orderItem:newOrderItems,shippingAddress1,shippingAddress2,city,zip,country,phone,status,totalPrice:totalPrice,user:req.user.userId });
    await neworder.save();
    if (!neworder) {
        return res.status(400).json({ message: "the order cannot be createOrder" });
    }
      res.json(neworder);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;
      await Order.findByIdAndDelete(id);
      res.json("the order delete is successfull");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const { status } = req.body;
      const { id } = req.params;
      await Order.findByIdAndUpdate(id, { status });
      res.json("the order update is successfull");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  order: async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate("user","name")
      .populate({path:"orderItem",populate:"product"});
      res.json(order);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  count:async (req, res) => {
    try {
      const orderCount = await Order.countDocuments()
      res.json(orderCount)
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  totalSales:async (req, res) => {
    try {
     const totalSales=await Order.aggregate([
       {
         $group: {_id:null,totalsales:{$sum:"$totalPrice"}}
       }
     ])
     if(!totalSales){
      return res.status(400).json({ message: "the order sales connot be " });
     }
     res.json({totalsales:totalSales.pop().totalsales})
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = orderCtrl;
