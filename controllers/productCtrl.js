const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const productCtrl = {
  productList: async (req, res) => {
    try {
      let filter={}
      if(req.query.categories){
         filter ={category:req.query.categories.split(",")};
      }
      const products = await Product.find(filter).populate('category');;
      res.json(products);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const categoryId = await Category.findById(req.body.category)
      if(!categoryId) {
        return res.status(400).json({ message: "Category not found" });
      }
      const {filename} = req.file;
      const basePath=`${req.protocol}://${req.get("host")}/public/upload/`
      const { name, description,richDescription,brand,price,category,countInStock,rating,numReviews,isFeatured } = req.body;
      const newProduct = new Product({ name, description,richDescription,
        image:`${basePath}${filename}`
        ,brand,price,category,countInStock,rating,numReviews,isFeatured });
      await newProduct.save();
      res.json(newProduct);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.json("the product delete is successfull");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { name, description,richDescription,image,brand,price,category,countInStock,rating,numReviews,isFeatured } = req.body;
      const { id } = req.params;
      await Product.findByIdAndUpdate(id, { name, description,richDescription,image,brand,price,category,countInStock,rating,numReviews,isFeatured });
      res.json("the product update is successfull");
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  product: async (req, res) => {
    try {
      const {id}=req.params;
      const product = await Product.findById(id).populate('category');
      res.json(product);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  count: async (req, res) => {
    try {
      const productCount = await Product.countDocuments()
      res.json(productCount)
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },  
  featured: async (req, res) => {
    try {
      const products = await Product.find({isFeatured:true})
      res.json(products)
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },  
  featuredCount: async (req, res) => {
    try {
      const {count}=req.params || 0;
      const products = await Product.find({isFeatured:true}).limit(count)
      res.json(products)
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateImage: async (req, res) => {
    try {
      const files=req.files;
      const imagesPaths=[];
      const basePath=`${req.protocol}://${req.get("host")}/public/upload/`
      if(files){
        files.map(file =>{
          imagesPaths.push(`${basePath}${file.filename}`)
        })
      }
      const { id } = req.params;
      const product=await Product.findByIdAndUpdate(id, { images: imagesPaths});
      res.json(product);

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
module.exports = productCtrl;
