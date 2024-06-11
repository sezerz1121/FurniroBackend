import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
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

const addressSetup = asyncHandler
(
    async(req,res)=>
    {
        const{country,fullname,mobilenumber,pincode,flathouseno,area,landmark,towncity,state,userId} = req.body;


        if ([country,fullname,mobilenumber,pincode,flathouseno,area,landmark,towncity,state,userId].some((fields) => fields?.trim()=== ""))
        {
               throw new ApiError(400,"all fields required");
        }

        
        const address =await Address.create
        (
           {
                country,
                fullname,
                mobilenumber,
                pincode,
                flathouseno,
                area,
                landmark,
                towncity,
                state

           }
        )

        const createdAddress =await Address.findById(address._id)

        if(!createdAddress)
        {
           throw  new ApiError(500,"someting went wrong");
        }

        const user = await User.findByIdAndUpdate(userId, { address: createdAddress._id }, { new: true });

        if (!user) {
            throw new ApiError(404, "User not found");
        }
       return res.status(201).json
       (
           new ApiResponse(200,createdAddress,"address registered succesfully")
       )




    }

)




  
export 
{
    addressSetup
}