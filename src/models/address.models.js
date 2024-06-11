import mongoose from "mongoose";


const addressSchema = new mongoose.Schema
(
{
    country:
    {
        type: String,
        required: true
        
    },
    fullname:
    {
        type: String,
        required: true
    },
    mobilenumber:
    {
        type: Number,
        required: true
    },
    pincode:
    {
        type: Number,
        required: true
    },
    flathouseno:
    {
        type: String,
        required: true
    },
    area:
    {
        type: String,
        required: true
    },
    landmark:
    {
        type: String,
        required: true
    },
    towncity:
    {
        type: String,
        required: true
    },
    state:
    {
        type: String,
        required: true
    },
    
},{timestamps: true}
);

export const Address = mongoose.model("Address",addressSchema)