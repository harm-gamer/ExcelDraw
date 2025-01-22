import {  RoomCanvax } from "@/components/RoomCanvax";


export default async function CanvaxPage({params}:{
    params : {
        roomId : string
    }
}){
    const roomId =(await params).roomId;

    return <RoomCanvax roomId={roomId} />
       
}