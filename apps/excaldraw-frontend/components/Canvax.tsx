import { useRef, useState } from "react";
import { useEffect } from "react";

import { Indraw } from "@/draw";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontal } from "lucide-react";
import { Game } from "@/draw/game";


export type Tool = "rect" | "circle" | "pencil";

export function Canvax(
    {roomId,
     socket
    } : {roomId : string, socket : WebSocket}
){
   const [selectTool,setSelectTool] = useState<Tool>("circle");
   const [game,setGame] = useState<Game>();

     const convaxRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        
        if(convaxRef.current){
         const g = new Game(convaxRef.current,roomId,socket)   
         setGame(g)
        }
       },[convaxRef])

       useEffect(() =>{
       game?.setTool(selectTool);
       },[selectTool,game])
       return (
        <div style={{
            height : "100vh",
            overflow : "hidden",
        }}>
          <canvas ref={convaxRef} width={window.innerWidth} height={window.innerHeight}></canvas>
<Toolbar selectTool={selectTool} setSelectTool={setSelectTool} />
        </div>
       )
}

function Toolbar({selectTool,setSelectTool} : {
    selectTool : Tool,
    setSelectTool : (tool : Tool) => void
}){

    return (
        <div style={{
            position : "fixed",
            top : 10,
            left : 10,
        }}>
            <div className="flex gap-t">
               <IconButton isActivated={selectTool === "pencil"} icon={<Pencil/>} onClick={()=>{setSelectTool("pencil")}}/>
               <IconButton isActivated={selectTool ===  "circle"} icon={<Circle/>} onClick={()=>{setSelectTool("circle")}}/>
               <IconButton isActivated={selectTool === "rect"} icon={<RectangleHorizontal/>} onClick={()=>{setSelectTool("rect")}}/>
            </div>

        </div>
    )
}