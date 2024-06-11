import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { Address } from "../models/address.models.js";
import { User } from "../models/user.models.js";
import { Saved } from "../models/saved.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

import dotenv from "dotenv";
dotenv.config();



const saveProduct = asyncHandler(async (req, res) => {
   const { productId,userId } = req.body; 


  
   
      
       if(!userId)
      {
            throw new ApiError(400, "userId required");
      }
      if(!productId)
      {
               throw new ApiError(400, "productId required");
      }

      
      const userExist = await User.findById(userId);
      const productExist = await Product.findById(productId);

      if(!userExist)
      {
         throw new ApiError(400, "user does not exist");
      }
      if(!productExist)
      {
         throw new ApiError(400, "product does not exist");
      }

      const saved = await Saved.create({
         product:productId,
         user:userId
       });

       const newSaved = await Saved.findById(saved._id)
 
       if (!newSaved) {
         throw new ApiError(500, "Something went wrong");
       }
     
       return res.status(201).json(
         new ApiResponse(200, newSaved, "product saved successfully")
       );
});

const unsaveProduct = asyncHandler(async (req, res) => {
   const { userId, productId } = req.body;
 
   if (!userId) {
     throw new ApiError(400, "userId required");
   }
   if (!productId) {
     throw new ApiError(400, "productId required");
   }
 
   const userExist = await User.findById(userId);
   const productExist = await Product.findById(productId);
 
   if (!userExist) {
     throw new ApiError(400, "user does not exist");
   }
   if (!productExist) {
     throw new ApiError(400, "product does not exist");
   }
 
   const savedProduct = await Saved.findOne({ user:userId, product:productId });
   
   if (!savedProduct) {
     throw new ApiError(400, "Saved product not found");
   }
 
   const removeSavedProduct = await Saved.deleteOne({ _id: savedProduct._id });
 
   if (removeSavedProduct.deletedCount === 0) {
     throw new ApiError(500, "Failed to unsave the product");
   }
 
   return res.status(200).json(
     new ApiResponse(200, null, "Product unsaved successfully")
   );
 });



 const checksavedProduct = asyncHandler(async (req, res) => {
   const { userId, productId } = req.body;
 
   if (!userId) {
     throw new ApiError(400, "userId required");
   }
   if (!productId) {
     throw new ApiError(400, "productId required");
   }
 
   const userExist = await User.findById(userId);
   const productExist = await Product.findById(productId);
 
   if (!userExist) {
     throw new ApiError(400, "user does not exist");
   }
   if (!productExist) {
     throw new ApiError(400, "product does not exist");
   }
 
   const savedProduct = await Saved.findOne({ user:userId, product:productId });

   const isSaved = !!savedProduct;
 
   return res.status(200).json(
     new ApiResponse(200, { isSaved })
   );
 });


 const savedProductList = asyncHandler(async (req, res) => {
  const { userId} = req.body;

  if (!userId) {
    throw new ApiError(400, "userId required");
  }

  

  const userExist = await User.findById(userId);


  if (!userExist) {
    throw new ApiError(400, "user does not exist");
  }


  const savedProducts = await Saved.find({ user:userId});

  const productsArray = [];

  savedProducts.forEach(savedProduct => {
    productsArray.push(savedProduct.product); 
  });


  const products = await Product.find({ _id: { $in: productsArray } });
   res.json(products);



});

 
  
export 
{
   saveProduct,
   unsaveProduct,
   checksavedProduct,
   savedProductList
}