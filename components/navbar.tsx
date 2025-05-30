'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { logOut } from '@/app/(auth)/actions';
import Image from 'next/image';

export default function Navbar({ token }: { token?: string }) {
    const [isNavOpen, setOpen] = useState(false);
    const [isProfileOpen, profOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const session = token;

        if (session) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [token])

    const hamburguerHandler = () => {
        setOpen((prev) => !prev)
        profOpen(false)
    }

    const profileHandler = () => {
        profOpen((prev) => !prev)
        setOpen(false)
    }

    return (
        <nav className="relative bg-[#000814] text-white">
            <div className="lg:hidden p-5 flex justify-between">
                <button className="space-y-2" onClick={hamburguerHandler} aria-label="Toggle hamburguer menu" aria-expanded={isNavOpen}>
                    <span className="block h-0.5 w-8 bg-gray-600"></span>
                    <span className="block h-0.5 w-8 bg-gray-600"></span>
                    <span className="block h-0.5 w-8 bg-gray-600"></span>
                </button>
                <button className="space-y-2" onClick={profileHandler} aria-label="Toggle profile menu" aria-expanded={isProfileOpen}>
                    <Image src="/profile-white.svg" alt="profile image" width={40} height={40} />
                </button>
            </div>

            {/* this is mobile view */}
            <div className={`${isNavOpen ? "flex" : "hidden"} bg-[#010f24] lg:hidden`}>
                <ul role="menu" className="flex flex-col px-5 gap-4 py-3">
                    <li role="menuitem">
                        <Link href="/" className="hover:bg-[#041b3d]">Home</Link>
                    </li>
                    <li role="menuitem">
                        <Link href="/reviews" className="hover:bg-[#041b3d]">Reviews</Link>
                    </li>
                    <li role="menuitem">
                        <Link href="/genres" className="hover:bg-[#041b3d]">Genres</Link>
                    </li>
                    <li role="menuitem">
                        <Link href="/about" className="hover:bg-[#041b3d]">About</Link>
                    </li>
                </ul>
            </div>

            {isLoggedIn ?
                <form action={logOut} className={`${isProfileOpen ? "flex" : "hidden"} bg-[#010f24] lg:hidden justify-end`}>
                    <button type="submit" className="hover:bg-[#041b3d] px-5 gap-4 py-3">Logout</button>
                </form>
                :
                <div className={`${isProfileOpen ? "flex" : "hidden"} bg-[#010f24] lg:hidden justify-end`}>
                    <ul role="menu" className="flex flex-col px-5 gap-4 py-3 ">
                        <li role="menuitem">
                            <Link href="/login" className="hover:bg-[#041b3d]">Log in</Link>
                        </li>
                        <li role="menuitem">
                            <Link href="/signup" className="hover:bg-[#041b3d]">Sign up</Link>
                        </li>
                    </ul>
                </div>}

            {/* this is desktop view */}
            <div className="hidden lg:flex justify-between items-center px-6 py-4 bg-[#000814] text-white shadow">
                <div className="flex gap-4">
                    <Link href="/" className="hover:bg-[#041b3d] p-1">Home</Link>
                    <Link href="/reviews" className="hover:bg-[#041b3d] p-1">Reviews</Link>
                    <Link href="/genres" className="hover:bg-[#041b3d] p-1">Genres</Link>
                    <Link href="/about" className="hover:bg-[#041b3d] p-1">About</Link>
                </div>

                {isLoggedIn ? 
                    <form action={logOut}>
                        <button type="submit" className="hover:bg-[#041b3d] p-1">Logout</button>
                    </form>
                : 
                    <div className="flex gap-4">
                        <Link href="/login" className="hover:bg-[#041b3d] p-1">Log in</Link>
                        <Link href="/signup" className="hover:bg-[#041b3d] p-1">Sign up</Link>
                    </div>
                }

            </div>

        </nav>
    )
}