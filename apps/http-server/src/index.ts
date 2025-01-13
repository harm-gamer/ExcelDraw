import express from "express"
import { middleware } from "./middleware";
import {CreateUserSchema,SigninSchema,CreateRoomSchema} from "@repo/common/type"
import dotenv from "dotenv"
dotenv.config()
const app = express();
import jwt from "jsonwebtoken"
import {JWT_SECRET} from "@repo/backend-common/config"

const port = process.env.PORT

app.post("/signup", (req, res) => {

    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // db call
    res.json({
        userId: "123"
    })
})

app.post("/signin", (req, res) => {
    const data = SigninSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    const userId = 1;
    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // db call

    res.json({
        roomId: 123
    })
})

app.listen(3001);
app.listen(port,()=>{
    console.log("port listing http");
})