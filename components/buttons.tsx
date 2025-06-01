import { IsLogged } from '@/actions';
import { logOut } from '@/app/(auth)/actions';
import Link from 'next/link';
import 'server-only'

export default async function Buttons() {    
    const session = await IsLogged();

    if (session) {
        <form action={logOut}>
            <button type="submit" className="hover:bg-[#041b3d] p-1">Logout</button>
        </form>
    } else {
        <div className="flex gap-4">
            <Link href="/login" className="hover:bg-[#041b3d] p-1">Log in</Link>
            <Link href="/signup" className="hover:bg-[#041b3d] p-1">Sign up</Link>
        </div>
    }
}