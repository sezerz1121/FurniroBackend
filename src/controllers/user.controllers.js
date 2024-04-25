import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { pdf } from "../utils/PDF.js"




const registerUser = asyncHandler
(
    async(req,res) => 
    {
      
         const {email,username,fullName,password} = req.body;
         
         if ([email,username,fullName,password].some((fields) => fields?.trim()=== ""))
         {
            throw new ApiError(400,"all fields required");
         }
         const existedUser = await User.findOne({$or:[{ username },{ email }]});

         if(existedUser)
         {
            throw new ApiError(409,"Username or Email already exist")
         }
         const avatarLocalPath =req.files?.avatar[0]?.path;
         let coverImageLocalPath;

         if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0)
         {
            coverImageLocalPath =req.files.coverImage[0].path;
         }

         console.log(avatarLocalPath);
         if(!avatarLocalPath)
         {
            throw new ApiError(400,"avatar file is reequired");
         }

        
         const avatar = await uploadOnCloudinary(avatarLocalPath);
         const coverImage = await uploadOnCloudinary(coverImageLocalPath);
         const user =await User.create
         (
            {
                fullName,
                avatar: avatar.secure_url,
                coverImage : coverImage?.secure_url || "",
                email,
                password,
                username: username.toLowerCase(),
            }
         )

         const createdUser =await User.findById(user._id).select("-password -refreshToken");

         if(!createdUser)
         {
            throw  new ApiError(500,"someting went wrong");
         }

        return res.status(201).json
        (
            new ApiResponse(200,createdUser,"user registered succesfully")
        )

        
    }
)

const PDF = asyncHandler(async (req, res) => {
   const _id = "66294b1f0ca43b9e5524eb7a";

   
       
       const pdfPath = await pdf(_id);

      
       const coverImage = await uploadOnCloudinary(pdfPath);

       
       console.log(pdfPath);
       console.log(coverImage.secure_url);

       
       return res.status(200).json(new ApiResponse(200, null, "PDF generated and uploaded successfully"));
  
});
export {registerUser,PDF}