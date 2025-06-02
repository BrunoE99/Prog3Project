'use client'

import { logIn } from "./actions"
import { useActionState } from "react"

export default function Login() {
    const [state, action, pending] = useActionState(logIn, undefined)

    return (
        <form action={action} className="flex flex-col gap-3 items-center m-5 bg-white rounded-2xl shadow-md w-full md:w-100 py-20">
            <div className="flex gap-2 items-center justify-center w-100">
                <input id="email" name="email" placeholder="Email" className="border rounded-md p-1 text-black bg-gray-100 w-[80%]"/>
            </div>
            {state?.errors?.email && <p>{state.errors.email}</p>}
            <div className="flex gap-2 items-center justify-center w-100">
                <input id="password" name="password" type="password" placeholder="Password" className="border rounded-md p-1 text-black bg-gray-100 w-[80%]"/>
            </div>
            <button disabled={pending} type="submit" className="uppercase rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
            shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] w-35">Log in</button>
            <hr className="w-[80%] text-black"></hr>
            <button disabled={pending} type="submit" className="uppercase rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
            shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none 
            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-green-600 w-35">Sign up</button>
            {state?.errors && <p className="bg-red-500 p-3 rounded-full">{state.errors}</p>}
        </form>
    )
}