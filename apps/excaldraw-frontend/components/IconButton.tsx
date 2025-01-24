import { ReactNode } from "react";


export function IconButton({icon,onClick,isActivated}:{
    icon : ReactNode,
    onClick : () => void;
    isActivated : boolean
}){

    return (
        <div onClick={onClick} className={`m-2 pointer rounded-full border p-2 bg-black hover:bg-gray ${isActivated ? "text-red-400" : "text-white"}`}>
            {icon}
        </div>
    )
}