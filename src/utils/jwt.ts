import Jwt  from "jsonwebtoken";


const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET! ;

export const generateAccessToken =(payload : object)=>{
   return Jwt.sign(payload , ACCESS_SECRET, {
    expiresIn : "15m"
   })
}

export const generateRefreshToken =(payload : object)=>{
    return Jwt.sign(payload , REFRESH_SECRET, {
     expiresIn : "7d"
    })
 }     

