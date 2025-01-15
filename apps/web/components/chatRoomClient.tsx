"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";


export  function ChatRoomClient({id,messages} : {id : string,messages : {message : string}[]}){

    const {loading,socket} = useSocket();
    const [chats,setChats] = useState(messages);
    const [currentMessages,setCurrentMessage] = useState("")

    useEffect(() =>{
        if(socket &&!loading){
            socket.send(JSON.stringify({
                type : "join_room",
                roomId : id
            }));

            socket.onmessage =(event) =>{
     const parsedData = JSON.parse(event.data)
             if(parsedData.type === "chat"){
                setChats(c => [...c,{message : parsedData.message}])
             }
            }
        }
    },[socket,loading,id])
    return (
        <div>
          {chats.map(m => <div>{m.message}</div>)}
          <input type="text" value={currentMessages} onChange={e =>{
            setCurrentMessage(e.target.value)
          }} ></input>
          <button onClick={() =>{
            socket?.send(JSON.stringify({
                type : "chat",
                roomId : id,
                message : currentMessages
            }))
            setCurrentMessage("")
          }}>Send message</button>
        </div>
    )
}