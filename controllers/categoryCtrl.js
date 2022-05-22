const Category = require("../models/categoryModel");
const categoryCtrl = {
  categoryList: async (req, res) => {
    try {
      const categoris = await Category.find();
      res.json(categoris);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name, icon, color } = req.body;
      const newcategory = new Category({ name, icon, color });
      await newcategory.save();
      if (!newcategory) {
        return res
          .status(400)
          .json({ message: "the category cannot be createCategory" });
      }
      res.json(newcategory);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      await Category.findByIdAndDelete(id);
      res.json("the category delete is successfull");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name, icon, color } = req.body;
      const { id } = req.params;
      await Category.findByIdAndUpdate(id, { name, icon, color });
      res.json("the category update is successfull");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  category: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      res.json(category);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = categoryCtrl;
