import { useRef } from "react";
import { useEffect } from "react";

import { Indraw } from "@/draw";
export function Canvax(
    {roomId,
     socket
    } : {roomId : string, socket : WebSocket}
){
     const convaxRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        
        if(convaxRef.current){
            Indraw(convaxRef.current,roomId,socket)
        }
       },[convaxRef])

       return (
        <div>
          <canvas ref={convaxRef} width={2000} height={1080}></canvas>
        </div>
       )
}