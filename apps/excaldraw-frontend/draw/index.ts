import axios from "axios";
import { HTTP_BACKEND } from "@/config";

type Shape = {
     type : "rect";
      x : number;
      y : number;
      width : number;
      height : number;
} | {
    type : "circle";
    CenterX : number;
    CenterY : number;
    radius : number;
}


export async function Indraw(canvax : HTMLCanvasElement,roomId : string
    ,socket : WebSocket
){
          
  let existingShape : Shape[] = await getExistingShapes(roomId)
  console.log(existingShape)
    const ctx = canvax.getContext('2d');
      if(!ctx){
        return
      }

      socket.onmessage=(event) =>{
        const message = JSON.parse(event.data);

        if(message.type == "chat"){
            const parsedShape = JSON.parse(message.message)
            existingShape.push(parsedShape.shape)
            clearCanvax(existingShape,canvax,ctx)
        }
      }

      clearCanvax(existingShape,canvax,ctx)
       
      let clicked = false;
      let startX = 0;
      let startY = 0;


     canvax.addEventListener("mousedown",(e)=>{
          clicked = true;
         
        startX = e.clientX;
        startY = e.clientY;
      })
      canvax.addEventListener("mouseup",(e)=>{
        clicked = false;
        let height = e.clientX - startX;
        let width = e.clientY - startY;

const shape :Shape = {
    type : "rect",
    x : startX,
    y : startY,
    height,
    width
}

   existingShape.push(shape);
        socket.send(
            JSON.stringify({
                type : "chat",
                message : JSON.stringify({
                    shape
                }),
                roomId
            })
        )

      })

      canvax.addEventListener("mousemove",(e) =>{
        if(clicked){
      
            let width = e.clientX - startX;
            let height = e.clientY - startY;

           clearCanvax(existingShape,canvax,ctx);
            ctx.strokeStyle = 'rgb(255,255,255)'
            ctx.strokeRect(startX,startY,width,height)
        }
      })
}

function clearCanvax(existingShapes : Shape[],canvax : HTMLCanvasElement,ctx : CanvasRenderingContext2D){
    ctx.clearRect(0,0,canvax.width,canvax.height);
     ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0,0,canvax.width,canvax.height)

    existingShapes.map((shape) =>{
        if(shape.type === "rect"){
            ctx.strokeStyle = 'rgb(255,255,255)'
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
        }
    })
}

async function getExistingShapes(roomId : string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
    const messages = res.data.messages;

    const shapes = messages.map((x : {message : string}) =>{
        const messageData = JSON.parse(x.message);

        return messageData.shape
    })

    return shapes

}