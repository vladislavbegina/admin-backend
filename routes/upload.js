import express from "express";
import multer from "multer";
import { auth, adminOnly } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req,file,cb)=>{
    cb(null, Date.now()+"-"+file.originalname);
  }
});

const upload = multer({ storage });

router.post("/video", auth, adminOnly, upload.single("video"), (req,res)=>{
  res.json({
    message:"Video uploaded",
    file:req.file.filename
  });
});

export default router;
