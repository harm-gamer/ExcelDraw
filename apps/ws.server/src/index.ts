import { WebSocketServer } from "ws";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"
const ws = new WebSocketServer({port : 8000});
import {JWT_SECRET} from "@repo/backend-common/config"
ws.on('connection', function connection(ws,request){ 

    const url = request.url;
if(!url)
{
    return;
}
    const queryParams =new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get('token') || "";
const decoded = jwt.verify(token,JWT_SECRET);

if(!decoded || !(decoded as JwtPayload).userId) {
    ws.close();
    return;
}


    
    ws.on('message', function message(data){
        ws.send("pong")
    })
})