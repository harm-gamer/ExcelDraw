import express from "express"
import cors from "cors"
import { middleware } from "./middleware"
// import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/type"
import dotenv from "dotenv"
dotenv.config()
const app = express();
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client";  

const port = process.env.PORT
app.use(express.json())
app.use(cors())
import {z} from "zod"

 const CreateUserSchema = z.object({
    username : z.string().min(5).max(20),
    password : z.string(),
    name : z.string()
})
 const SigninSchema = z.object({
    username : z.string().min(5).max(20),
    password : z.string(),

})

 const CreateRoomSchema = z.object({
name : z.string().min(5).max(12)
})

app.post("/signup", async(req, res) => {

    const Safedata = CreateUserSchema.safeParse(req.body);
    if (!Safedata.success) {
        console.log(Safedata)
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
   try{    
       const newUser = await prismaClient.user.create({
        data:{
            email:Safedata.data?.username,
            name : Safedata.data.name,
            password : Safedata.data.password
        }
       })
    res.json({
        userId : newUser.id
    })
}catch(e){
    res.status(404).json({msg : "User Already exist"})
}
})

app.post("/signin",async (req, res) => {
    const parsedata = SigninSchema.safeParse(req.body);
    if (!parsedata.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
   try{
    const user = await prismaClient.user.findFirst({
        where:{
            email : parsedata.data.username,
            password : parsedata.data.password,
        }
    })
    console.log(user);
    if(!user){
        res.status(403).json({msg : "user not found"})
    }
    const token = jwt.sign({
        userId : user?.id
    }, JWT_SECRET);

    res.json({
        token
    })

   }catch(e){
      res.status(200).json({msg: "invalid credentials"})
   }
   
})

app.post("/room", middleware, async (req, res) => {
    const parsedata = CreateRoomSchema.safeParse(req.body);
    if (!parsedata.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
        
    }
    
    
    try{
        const userId = req.userId;
        const room = await prismaClient.room.create({
            data : {
               slug : parsedata.data.name,
               adminId : userId || ""

            }
      })
   
       res.json({
           roomId: room.id
       })
    }catch(e){ res.status(411).json({
        message: "Room already exists with this name"
    })

    }

   
})

app.get("/chats/:roomId",async(req,res)=>{
    try{
       const roomId = Number(req.params.roomId);
       console.log(req.params.roomId);

       const messages = await prismaClient.chat.findMany({
        where : {
            roomId : roomId
        },
        orderBy : {
            id : "desc"
        },
        take : 50
       })
       res.json({
        messages
       })
    }catch(e){
       console.log(e);
       res.json({
        messages : []
       })
    }
})

app.get("/room/:slug",async (req,res) =>{
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where : {
            slug
        }
    });

    res.json({
        room
    })
})
app.listen(5000,()=>{
    console.log("port listing http");
})