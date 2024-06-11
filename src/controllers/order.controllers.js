import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { Address } from "../models/address.models.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

import dotenv from "dotenv";
dotenv.config();


const productListing = asyncHandler
(
   async(req,res)=>
   {
      const {name,productImage,prices,stock,category} = req.body;

      const existedProduct = await Product.findOne({ name });

      if(existedProduct)
      {
         throw new ApiError(409,"Product already exist")
      }

      const productImageLocalPath =req.files?.productImage[0]?.path;

      if(!productImageLocalPath)
      {
         throw new ApiError(400,"avatar file is required");
      }

      const productImageUpload = await uploadOnCloudinary(productImageLocalPath);

      const product =await Product.create
      (
         {
            name,
            productImage:productImageUpload.secure_url,
            prices,
            stock,
            category
         }
      )

      const newProduct = await Product.findById(product._id);
      if(!newProduct)
      {
         throw  new ApiError(500,"someting went wrong");
      }
   
      return res.status(201).json
      (
               new ApiResponse(200,newProduct,"new product listed succesfully")
      )

      

   }
)

const Buy = asyncHandler
(
    async(req,res)=>
    {
        const {orderPrice,userId,orderItems,addressId} = req.body;

        if (
         orderPrice === undefined || 
         userId === undefined || 
         orderItems === undefined ||  
         addressId === undefined
      )
      {
         throw new ApiError(400, "All fields are required");
      }
         const existedUser = await User.findById( userId );
 
         if (!existedUser) {
           throw new ApiError(409, "User does not exist");
         }
         const existedProduct = await Product.findOne({ _id: orderItems[0].productId });

         if(!existedProduct)
         {
            throw new ApiError(409,"Product does not exist")
         }

         const existedAddress= await Address.findOne({ _id: addressId });

         if(!existedAddress)
         {
            throw new ApiError(409,"Address does not exist");
         }
         if(existedProduct.stock===0)
            {
               throw new ApiError(409,"Product is out of stock")
            }

    
         
        
        const order = await Order.create({
            orderPrice,
            customer: userId,
            orderItems: orderItems,
            address: addressId,
            status: "PENDING"
        });



        existedProduct.stock -= orderItems[0].quantity;
        await existedProduct.save();

        existedUser.orders.push(order._id);
        await existedUser.save();


        const createdOrder = await Order.findById(order._id)
        if (!createdOrder) {
          throw new ApiError(500, "Something went wrong");
        }
      
        return res.status(201).json(
          new ApiResponse(200, createdOrder, "Order placed successfully")
        );



         

    }


)


const orderList = asyncHandler(async (req, res) => {
   const { userId } = req.body; 
   
  
   
      
       if(!userId)
      {
            throw new ApiError(400, "user does not exist");
      }

       
      const orders = await Order.find({ customer: { $in: userId } });

      
       
       return res.status(200).json(
         new ApiResponse(200, orders, "Order fetch successfully")
       );
   
   
});




  
export 
{
   Buy,
   orderList
}