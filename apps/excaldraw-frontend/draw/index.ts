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
} | {
  type : "pencil";
  startX : number;
  startY : number;
  endX : number;
  endY : number;
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
        const height = e.clientX - startX;
        const width = e.clientY - startY;
        //@ts-ignore
    const selectedTool = window.selectTool;
    let shape : Shape | null = null;
    if(selectedTool === "rect"){
       shape = {
       
          type : "rect",
          x : startX,
          y : startY,
          height,
          width
      }
      
       
    }else if(selectedTool === "circle"){
      const radius = Math.max(height,width) /2;
       shape = {
       
        type : "circle",
        radius : radius ,
        CenterX : startX + radius,
        CenterY : startY + radius
    }
    
     
    }
    if(!shape){
      return;
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
      
            const width = e.clientX - startX;
            const height = e.clientY - startY;

           clearCanvax(existingShape,canvax,ctx);
            ctx.strokeStyle = 'rgb(255,255,255)'
            
           
          //@ts-ignore
           const selectedTool = window.selectTool
           if(selectedTool  === "rect"){
            ctx.strokeRect(startX,startY,width,height)
           }
           else if(selectedTool === "circle"){
            const radius = Math.max(width,height)/2; 
            const centerX = startX + radius;
              const centerY = startY + radius;

             
              ctx.beginPath();
              ctx.arc(centerX,centerY,radius,0,Math.PI *2);
              ctx.stroke();
              ctx.closePath();
            }
            
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
        }else if(shape.type === "circle"){
          ctx.beginPath();
          ctx.arc(shape.CenterX,shape.CenterY,shape.radius,0,Math.PI *2 )
          ctx.closePath()
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