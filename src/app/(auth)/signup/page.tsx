'use client'

import Link from "next/link"
import { signUp } from "./actions"
import { useActionState } from "react"

export default function Login() {
    const [state, action, pending] = useActionState(signUp, undefined)
    console.log(state);

    return (
        <form action={action} className="flex flex-col gap-3 items-center m-5 bg-white rounded-2xl shadow-md w-full md:w-100 py-20">
            <div className="flex gap-2 items-center justify-center w-100">
                <input id="username" name="username" placeholder="Username" className="border rounded-md p-1 text-black bg-gray-100 w-[80%]" />
            </div>
            {state?.errors?.username && <p className="text-red-500">{state.errors.username}</p>}
            <div className="flex gap-2 items-center justify-center w-100">
                <input id="email" name="email" placeholder="Email" className="border rounded-md p-1 text-black bg-gray-100 w-[80%]" />
            </div>
            {state?.errors?.email && <p className="text-red-500 text-center">{state.errors.email}</p>}
            <div className="flex gap-2 items-center justify-center w-100">
                <input id="password" name="password" placeholder="Password" type="password" className="border rounded-md p-1 text-black bg-gray-100 w-[80%]" />
            </div>
            {state?.errors?.password && (
                <div className="text-red-500">
                    <p>La password debe tener:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button disabled={pending} type="submit" className="uppercase rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
            shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] w-35">Register</button>
            {state?.message && <h1 className="border rounded p-2">{state.message}</h1>}
            <hr className="w-[80%] text-black"></hr>
            <button type="submit" className="uppercase rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
            shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none 
            disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-green-600 w-35"><Link href="/login">Log in</Link></button>
        </form>
        // <form action={action} className="flex flex-col gap-3 items-center m-5">
        //     <div className="flex gap-2 items-center w-100">
        //         <label htmlFor="username" className="text-left">Username</label>
        //         <input id="username" name="username" placeholder="Tsuki" className="border rounded p-0.5" />
        //     </div>
        //     {state?.errors?.username && <p>{state.errors.username}</p>}
        //     <div className="flex gap-2 items-center w-100">
        //         <label htmlFor="email" className="text-left">Email</label>
        //         <input id="email" name="email" placeholder="johndoe@example.com" className="border rounded p-0.5" />
        //     </div>
        //     {state?.errors?.email && <p>{state.errors.email}</p>}
        //     <div className="flex gap-2 items-center w-100">
        //         <label htmlFor="password">Password</label>
        //         <input id="password" name="password" type="password" className="border rounded p-0.5" />
        //     </div>
        //     {state?.errors?.password && (
        //         <div>
        //             <p>La password debe tener:</p>
        //             <ul>
        //                 {state.errors.password.map((error) => (
        //                     <li key={error}>- {error}</li>
        //                 ))}
        //             </ul>
        //         </div>
        //     )}
        //     <button disabled={pending} type="submit" className="bg-[#020b59] w-20 border rounded">Register</button>
        //     {state?.message && <h1 className="border rounded p-2">{state.message}</h1>}
        // </form>
    )
}