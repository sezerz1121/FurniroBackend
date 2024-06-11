import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { pdf } from "../utils/PDF.js";
import dotenv from "dotenv";
dotenv.config();

const generateAccessTokenAndRefreshToken= async(userID)=>
{
   try {
        const user= await User.findById(userID);
   
        const accessToken = user.generateAccessToken()
        const refreshToken= user.generateRefreshToken()
       
         user.refreshToken = refreshToken
         await user.save({validateBeforeSave: true})
         return {accessToken,refreshToken}

   } catch (error) {
      throw new ApiError(500,"something went wrong in generating access and refrsh token")
   }
}


const registerUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;
 
   if ([email, password].some((field) => field?.trim() === "")) {
     throw new ApiError(400, "All fields are required");
   }
 
   const existedUser = await User.findOne({ email });
 
   if (existedUser) {
     throw new ApiError(409, "Email already exists");
   }
 
   const user = await User.create({
     email,
     password
   });
 
   const createdUser = await User.findById(user._id).select("-password -refreshToken");
 
   if (!createdUser) {
     throw new ApiError(500, "Something went wrong");
   }
 
   return res.status(201).json(
     new ApiResponse(200, createdUser, "User registered successfully")
   );
 });
 




const loginUser = asyncHandler
( 
   async (req,res) =>
   {
      //check email or username exist
      //check password
      //genrate token and make them login
      
      const {email , password } = req.body;
      


      

      if(!email)
      {
         throw new ApiError(400,"Usernam or email required")
      }

      const user =await User.findOne({email})
      if(!user)
      {
         throw new ApiError(404,"user does not exist")
      }
      const isPasswordValid = await user.isPasswordCorrect(password);

      if(!isPasswordValid )
      {
         throw new ApiError(401,"Password invalid")
      }
      const {accessToken,refreshToken} =await generateAccessTokenAndRefreshToken(user._id);
      
      const loggedIn = await User.findById(user._id).select("-password -refreshToken");

      const options=
      {
         httpOnly:true,
         secure: true
      }

      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
         new ApiResponse(200,
         {
            user: loggedIn,accessToken,refreshToken
         },
         "user logged in successfully"
      )
      )
   }

)

const logoutUser = asyncHandler
(
   async(req,res) =>
   {
     
         const user =await User.findByIdAndUpdate
         (req.user._id,
            {
               $set:{refreshToken:undefined}
            },
            {
               new: true
            }

         )
         
         const options=
         {
            httpOnly:true,
            secure: true
         }

         return res
         .status(200)
         .clearCookie("accessToken",options)
         .clearCookie("refreshToken",options)
         .json(new ApiResponse(200,{},"user logged out"))
         
   }

)

const refreshAccessToken = asyncHandler
(
   async(req,res) =>
   {
     const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken;

     if(!incomingRefreshToken)
     {
       throw new ApiError(401,"Unauthorized request")
     }
     try {
      const docodedToken =jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
 
      const user = await User.findById(docodedToken?._id);
 
      if(!user)
      {
        throw new ApiError(401,"Invaild refreshToken")
      }
 
      if(incomingRefreshToken !== user?.refreshToken)
      {
       throw new ApiError(401,"refresh token is expired or used")
      }
 
     const {accessToken,newRefreshToken} = await generateAccessTokenAndRefreshToken(user?._id);
 
      const options =
      {
          httpOnly: true,
          secure: true
      }
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newRefreshToken,options)
      .json(
         new ApiResponse(200,
         {
          accessToken,refreshToken:newRefreshToken
         },
         "Access token refreshed"
      )
      )
     } catch (error) {
       throw new ApiError(401,error?.message||"invalid refresh token")
     }

   }
)

const userInfo = asyncHandler
(
   async(req,res) =>
      {
        const incomingAccessToken= req.cookies.accessToken || req.body.accessToken;
   
        if(!incomingAccessToken)
        {
          throw new ApiError(401,"Unauthorized request")
        }
        try {
         const docodedToken =jwt.verify(incomingAccessToken,process.env.ACCESS_TOKEN_SECRET);
    
         const user = await User.findById(docodedToken?._id);
    
         if(!user)
         {
           throw new ApiError(401,"User does not Exist")
         }
    
         
         const userInfo = await User.findById(user._id).select("-password -refreshToken");
        
    
         
         return res.json(
            new ApiResponse(200,
            {
               userInfo
            },
            "User info"
         )
         )
        } catch (error) {
          throw new ApiError(401,error?.message||"User does not Exist ")
        }
   
      }
)


const userProductSave = asyncHandler(async (req, res) => {
   const { productId, userId } = req.body;
 
   try {
       
       const user = await User.findById(userId);

      
       if (!user) {
           throw new ApiError(401, "User does not exist");
       }

       
       if (user.saved.includes(productId)) {
           return res.json(new ApiResponse(200, null, "Product is already saved"));
       }

       
       user.saved.push(productId);

       
       await user.save();

       
       return res.json(new ApiResponse(200, { user }, "Product saved successfully"));
   } catch (error) {
       
       throw new ApiError(401, "Unable to save product");
   }
});

const userProductRemove = asyncHandler(async (req, res) => {
   const { productId, userId } = req.body;

   try {
       
       const user = await User.findById(userId);

       if (!user) {
           throw new ApiError(401, "User does not exist");
       }

      
       const productIndex = user.saved.indexOf(productId);
       if (productIndex === -1) {
           return res.json(new ApiResponse(200, null, "Product is not in saved list"));
       }

       
       user.saved.splice(productIndex, 1);

       
       await user.save();

      
       return res.json(new ApiResponse(200, { user }, "Product removed successfully"));
   } catch (error) {
       
       throw new ApiError(401, "Unable to remove product");
   }
});

const userProductCheck = asyncHandler(async (req, res) => {
   const { productId, userId } = req.body;

   try {
      
       const user = await User.findById(userId);

      
       if (!user) {
           throw new ApiError(401, "User does not exist");
       }

       
       const isSaved = user.saved.includes(productId);

      
       return res.json(new ApiResponse(200, { isSaved }, `Product is ${isSaved ? '' : 'not '}saved`));
   } catch (error) {
      
       throw new ApiError(401, "Unable to check product");
   }
});

export 
{
   registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   userInfo,
   userProductSave,
   userProductRemove,
   userProductCheck
   
}