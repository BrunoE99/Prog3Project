'use client'

import { signUp } from "./actions"
import { useActionState } from "react"

export default function Login() {
    const [state, action, pending] = useActionState(signUp, undefined)

    return (
        <form action={action} className="flex flex-col gap-3 items-center m-5">
            <div className="flex gap-2 items-center w-100">
                <label htmlFor="username" className="text-left">Username</label>
                <input id="username" name="username" placeholder="Tsuki" className="border rounded p-0.5" />
            </div>
            {state?.errors?.username && <p>{state.errors.username}</p>}
            <div className="flex gap-2 items-center w-100">
                <label htmlFor="email" className="text-left">Email</label>
                <input id="email" name="email" placeholder="johndoe@example.com" className="border rounded p-0.5" />
            </div>
            {state?.errors?.email && <p>{state.errors.email}</p>}
            <div className="flex gap-2 items-center w-100">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="border rounded p-0.5" />
            </div>
            {state?.errors?.password && (
                <div>
                    <p>La password debe tener:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button disabled={pending} type="submit" className="bg-[#020b59] w-20 border rounded">Register</button>
            {state?.message && <h1 className="border rounded p-2">{state.message}</h1>}
        </form>
    )
}