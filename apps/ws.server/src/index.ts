import {WebSocket, WebSocketServer } from "ws";

import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({port : 8080});


interface User{
    ws : WebSocket,
    rooms : string[],
    userId : string
}

const users : User[] = [];


function checkUser(token : string) : string | null {
    try{
     const decoded = jwt.verify(token,JWT_SECRET);

     if(typeof decoded == "string"){
        return null;
     }

     if(!decoded || !decoded.userId){
        return null
     }

     return decoded.userId;
    }catch(e){
       return null;
    }

    return null;
}

wss.on('connection',  function  connection(ws,request){ 

    const url = request.url;
if(!url)
{
    return;
}
    const queryParams =new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get('token') || "";


    const userId = checkUser(token);

    if(userId == null){
        ws.close()
        return null;
    }

   users.push({
    ws,
    userId,
    rooms :[]
    
   })

    ws.on('message',async function message(data){
         let parsedata;

         if(typeof data !== "string"){
           parsedata = JSON.parse(data.toString())
         }else{
            parsedata = JSON.parse(data)
         }

          if(parsedata.type === "join_room"){
            const user = users.find(x => x.ws === ws);
             user?.rooms.push(parsedata.roomId)
          }


          if(parsedata.type == "leave_room"){
            const user = users.find(x => x.ws === ws);
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedata.room)
          }

          if(parsedata.type === "chat"){
            const roomId = parsedata.roomId;
            const message = parsedata.message;
           
           await prismaClient.chat.create({
            data : {
                roomId : Number(roomId),
                message,
                userId
            }
           });

           users.forEach(user =>{
            if(user.rooms.includes(roomId)){
                user.ws.send(JSON.stringify({
                    type : "chat",
                    message:message,
                    roomId
                }))
            }
           })
          }
    })
})