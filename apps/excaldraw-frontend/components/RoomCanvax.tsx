"use client"

import { WS_URL } from "@/config";

import { useEffect, useRef, useState } from "react";
import { Canvax } from "./Canvax";

export function RoomCanvax
({roomId}:{roomId : string}){
    const convaxRef = useRef<HTMLCanvasElement>(null);
    const [socket,setSocket] = useState<WebSocket | null>(null)
       useEffect(()=>{
          const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOTYwYTE0MS1jOTc2LTRkY2UtODE2Yi05MGE2NzI5OGExMDkiLCJpYXQiOjE3Mzc1NDY1MzZ9.9_-w1dLTYuEjbb38ksZ4w-iwcSjLZ2Qkd4vBvlNKYHk`)

          ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }
       },[])

      

       if(!socket){
        return <div>
            Connecting to server...
        </div>
       }

    return (
        <div>
          <Canvax socket={socket}
           roomId={roomId} />

        </div>
    )
}