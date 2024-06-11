import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors());
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb" }));
app.use(express.static("public"));
app.use(cookieParser());



// import routes
import userRouter from "./routes/users.routes.js"
import productRouter from "./routes/products.routes.js"
import addressRouter from './routes/address.routes.js'
import orderRouter from './routes/order.routes.js'
import savedRouter from './routes/saved.routes.js'
// routes declaration

app.use("/users",userRouter);
app.use("/products",productRouter);
app.use("/address",addressRouter);
app.use("/order",orderRouter);
app.use("/save",savedRouter);


export {app} 

