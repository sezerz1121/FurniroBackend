import mongoose from "mongoose";

const pricesSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true,
        enum: ["L", "XL", "XS"]
    },
    price: {
        type: Number,
        required: true,
        default: 0
    }
});

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const productInfoSchema = new mongoose.Schema({
    fillingMaterial: {
        type: String,
        required: true
    },
    finishType: {
        type: String,
        required: true
    },
    adjustableHeadrest: {
        type: String,
        required: true,
        enum: ["yes", "no"]
    },
    loadCapacity: {
        type: Number,
        required: true
    }
});

const dimensionSchema = new mongoose.Schema({
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    depth: {
        type: Number,
        required: true
    },
    weight: {  // Corrected the typo here from 'weigth' to 'weight'
        type: Number,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    discount:
    {
        type: Number
    },
    productImage: {
        type: String,
        required: true
    },
    prices: {
        type: [pricesSchema]
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: [categorySchema]
    },
    productInfo: {
        type: productInfoSchema  // Fixed this part to reference the productInfoSchema correctly
    },
    dimensions: {
        type: dimensionSchema  // Fixed this part to reference the dimensionSchema correctly
    }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
