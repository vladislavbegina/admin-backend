import express from "express"

const router = express.Router()

// покупка подписки
router.post("/buy",(req,res)=>{

const {userId,type,price,days}=req.body

const expires=new Date()

expires.setDate(expires.getDate()+days)

res.json({

message:"Subscription created",

userId,
type,
price,
expiresAt:expires

})

})

// список подписок пользователя
router.get("/user/:id",(req,res)=>{

res.json({
message:"Subscriptions list",
userId:req.params.id
})

})

export default router
