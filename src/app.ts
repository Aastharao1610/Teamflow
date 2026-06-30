import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.get("/health" , (req,res)=>{
    res.status(200).json({message : "Testing the Server route is working fine"})
})

app.use("/api/v1/auth" , authRoutes)

app.use(errorMiddleware)

export default app;
