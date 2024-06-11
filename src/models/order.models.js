import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    name: 
    {
        type: String,
        required: true
    },
    productImage: 
    {
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    orderPrice: {
        type: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderItems: [orderItemSchema], // Corrected field name
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    status: {
        type: String,
        enum: ["PENDING", "CANCELLED", "DELIVERED"],
        default: "PENDING"
    }
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
