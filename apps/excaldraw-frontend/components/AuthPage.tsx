
"use client";

export function AuthPage({isSignin}: {
    isSignin: boolean
}) {
    return <div className="w-screen h-screen flex justify-center items-center bg-black">
        <div className="p-6 m-2 bg-white rounded">
            <div className="p-2 flex flex-col space-y-2">
                <input className="border-cyan-600" type="text" placeholder="Email"></input>
                <input type="text" placeholder="password"></input>
            </div>
            <div className="p-2">
                
            </div>

            <div className="pt-2">
                <button className="bg-red-200 rounded p-2" onClick={() => {

                }}>{isSignin ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    </div>

}
