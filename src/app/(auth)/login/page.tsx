export default function Login() {
    return (
        <form className="flex flex-col gap-3 items-center m-5">
            <div className="flex gap-2">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" placeholder="johndoe@example.com" className="border rounded p-0.5"/>
            </div>
            <div className="flex gap-2">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="border rounded p-0.5"/>
            </div>
            <button type="submit" className="bg-[#020b59] w-20 border rounded">Log in</button>
        </form>
    )
}