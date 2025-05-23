'use client'

import { logIn } from "./actions"
import { useActionState } from "react"

export default function Login() {
    const [state, action, pending] = useActionState(logIn, undefined)

    return (
        <form action={action} className="flex flex-col gap-3 items-center m-5">
            <div className="flex gap-2 items-center w-100">
                <label htmlFor="email" className="text-left">Email</label>
                <input id="email" name="email" placeholder="johndoe@example.com" className="border rounded p-0.5"/>
            </div>
            {state?.errors?.email && <p>{state.errors.email}</p>}
            <div className="flex gap-2 items-center w-100">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="border rounded p-0.5"/>
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
            <button disabled={pending} type="submit" className="bg-[#020b59] w-20 border rounded">Log in</button>
        </form>
    )
}