import express from "express"
import jwt from "jsonwebtoken"

const router = express.Router()

router.get("/profile",(req,res)=>{

const auth=req.headers.authorization

if(!auth){
return res.status(401).json({error:"No token"})
}

const token=auth.split(" ")[1]

try{

const decoded=jwt.verify(token,process.env.JWT_SECRET)

res.json({
message:"Profile loaded",
userId:decoded.userId
})

}catch{

res.status(401).json({error:"Invalid token"})

}

})

export default router
