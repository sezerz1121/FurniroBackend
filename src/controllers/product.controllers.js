import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { Product } from "../models/product.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

import dotenv from "dotenv";
dotenv.config();


const productListing = asyncHandler(async (req, res) => {
   const {
       name,
       productImage,
       discount,
       prices,
       stock,
       category,
       fillingMaterial,
       finishType,
       adjustableHeadrest,
       loadCapacity,
       dimensions
   } = req.body;



   const existedProduct = await Product.findOne({ name });

   if (existedProduct) {
       throw new ApiError(409, "Product already exists");
   }

   const productImageLocalPath = req.files?.productImage[0]?.path;

   if (!productImageLocalPath) {
       throw new ApiError(400, "Product image file is required");
   }

   const productImageUpload = await uploadOnCloudinary(productImageLocalPath);

   const categoryArray = category.split(',').map(cat => ({ name: cat.trim() }));

  
   const product = await Product.create({
       name,
       productImage: productImageUpload.secure_url,
       discount,
       prices,
       stock,
       category:categoryArray,
       productInfo: {
         fillingMaterial,
         finishType,
         adjustableHeadrest,
         loadCapacity
     },
     dimensions
   });

   const newProduct = await Product.findById(product._id);
   if (!newProduct) {
       throw new ApiError(500, "Something went wrong");
   }

   return res.status(201).json(
       new ApiResponse(200, newProduct, "New product listed successfully")
   );
});


const productList = asyncHandler(async (req, res) => {
    const productId = req.body.productId; // Assuming productId is sent in the request body
    
    
    try {
      const existedProduct = await Product.findOne({ _id: productId });
    
      if (!existedProduct) {
        throw new ApiError(404, "Product does not exist");
      }
    
      // Handle the case when the product exists
      res.json(existedProduct);
    } catch (error) {
      // Handle errors
      console.error("Error finding product:", error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  });
  
  

  const productAll = asyncHandler(async (req, res) => {
    try {
      const products = await Product.find(); 
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });


  const savedProductList = asyncHandler(async (req, res) => {
   const { productIds } = req.body; 
  
   try {
      
       if (!Array.isArray(productIds)) {
           throw new ApiError(400, "Invalid input: productIds must be an array");
       }

       
       const products = await Product.find({ _id: { $in: productIds } });


       
       res.json(products);
       
   } catch (error) {
       
       console.error("Error finding products:", error);
       res.status(error.statusCode || 500).json({ message: error.message });
   }
});


const productInfo = asyncHandler
(
   async(req,res)=>
   {
      const {productId} = req.body;
      

      const existedProduct = await Product.findOne({ _id: productId });

      if(!existedProduct)
      {
         throw new ApiError(409,"Product does not exist")
      }

      
   
   
      return res.status(200).json
      (
               new ApiResponse(200,existedProduct," product info fetched succesfully")
      )

      

   }
)
const orderProductList = asyncHandler(async (req, res) => {
   const { productIds } = req.body; // Assuming productIds is sent in the request body

   
   try {
     const existedProducts = await Product.find({ _id: { $in: productIds } });
   
     if (existedProducts.length === 0) {
       throw new ApiError(404, "Products do not exist");
     }
   
     // Handle the case when the products exist
     
     res.json(existedProducts);
   } catch (error) {
     // Handle errors
     console.error("Error finding products:", error);
     res.status(error.statusCode || 500).json({ message: error.message });
   }
 });
 

export 
{
   productListing,
   productList,
   productAll,
   savedProductList,
   productInfo,
   orderProductList
}