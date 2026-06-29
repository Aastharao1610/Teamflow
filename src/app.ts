import express from "express";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});

app.get("/health" , (req,res)=>{
    res.status(200).json({message : "Testing the Server route is working fine"})
})

app.use("/api/v1/auth" , authRoutes)

export default app;