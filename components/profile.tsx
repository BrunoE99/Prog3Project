import { userById } from "@/app/API/userId/route"
import Image from "next/image";
import ImageUpload from "./imageUpload";

// to remove scroll, set footer & navbar to h-[Xvh] and then the page to the rest h-[100-Xvh]
// mobile kinda wonky at ~300px ~350px

export default async function Profile({ userId }: { userId: number }) {
    const userInfo = await userById(userId);
    const imageName = userInfo.urlImagen.split('/').pop();

    console.log(userInfo);

    return (
        <div className="p-4 md:p-8">
            <div className="bg-white shadow-lg rounded-lg w-full mt-24">
                <div className="relative mt-12 pb-4">
                    <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl flex items-center justify-center text-indigo-500">
                        <Image
                            src={`http://localhost:3000/uploads/${imageName}`}
                            alt="user profile picture"
                            width={130}
                            height={130}
                            style={{ width: 'auto', height: 'auto' }}
                            className="rounded-full"
                        />
                    </div>
                    <ImageUpload />
                    {/* <div className="flex justify-center mt-4">
                        <button onClick={ImageUpload} className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                            Change profile image
                        </button>
                        <input placeholder="Select file" type="file" accept="image/*" className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5" />
                    </div> */}
                    </div>
                    <div className="text-center pb-12 px-4">
                        <h1 className="text-4xl font-medium text-gray-700">
                            {userInfo.username}
                            <span className="pl-2 font-light text-gray-500">{userInfo.nivel}</span>
                        </h1>
                        <p className="font-light text-gray-600 mt-3">{userInfo.email}</p>
                        <p className="mt-8 text-gray-500">Created at: {userInfo.fechaCreacion}</p>
                    </div>
                </div>
            </div>
            )
}