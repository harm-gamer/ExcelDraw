import { useEffect, useState } from "react";
import { WS_URL } from "../app/room/config";


export function useSocket(){
    const [loading,setLoading] = useState(true);
    const[ socket,setSocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY0YTEyOC04ZjU1LTQ0MDUtOWZlYi1iYzA2MjQxMjRmZmUiLCJpYXQiOjE3MzY4NDk0NjJ9.4P3IdreT4uu8m8dJTSNLcADcHZqcf6hW807qbRb9PUg`)
        ws.onopen =() =>{
            setLoading(false);
            setSocket(ws)
        }
    },[]);

    return {
        socket,loading
    }
}