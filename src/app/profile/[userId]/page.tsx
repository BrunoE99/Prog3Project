'use client'

import { useState } from "react"

type UserData = {
    username: string,
    email: string,
    rol: string,
    creationDate: string,
    nivel: number
}

export default function UserInformation() {
    // I need to make a GET with the ID of the user I want to display, and show that information on the profile page.
    const [userData, setUserData] = useState<UserData | null>(null)

    return (
        <div className="">
            <div className="p-3">
                <p>Username:</p>
            </div>
            <div className="p-3">
                <p>Mail:</p>
            </div>
            <div className="p-3">
                <p>Rol:</p>
            </div>
            <div className="p-3">
                <p>Nivel:</p>
            </div>
            <div className="p-3">
                <p>Created:</p>
            </div>
        </div>
    )
}