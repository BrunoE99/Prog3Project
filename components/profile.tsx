import { userById } from "@/app/API/userId/route";
import Image from "next/image";
import ImageUpload from "./imageUpload";
import ReviewsByUserID from "./reviewByUserID";

// to remove scroll, set footer & navbar to h-[Xvh] and then the page to the rest h-[100-Xvh]
// mobile kinda wonky at ~300px ~350px

// interface ProfileProps {
//     pagination: number;
// }

export default async function Profile({ userId, pagination }: { userId: number, pagination: number }) {
  const userInfo = await userById(userId);
  const imageName = userInfo.urlImagen.split("/").pop();

  return (
    <div className="p-4 md:p-8 bg-[#001d3d] min-h-screen">
      <div className="bg-[#003566] shadow-lg rounded-lg w-full mt-24">
        <div className="relative mt-12 pb-4">
          <div className="w-48 h-48 bg-[#001d3d] mx-auto rounded-full shadow-2xl flex items-center justify-center">
            <Image
              src={`http://localhost:3000/uploads/${imageName}`}
              alt="user profile picture"
              width={130}
              height={130}
              className="rounded-full object-cover h-full w-full"
            />
          </div>
          <ImageUpload />
        </div>
        <div className="text-center pb-12 px-4">
          <h1 className="text-4xl font-medium text-white">
            {userInfo.username}
            <span className="pl-2 font-light text-gray-300">
              {userInfo.nivel}
            </span>
          </h1>
          <p className="font-light text-gray-300 mt-3">{userInfo.email}</p>
          <p className="mt-8 text-gray-400">
            Created at: {userInfo.fechaCreacion}
          </p>
        </div>
      </div>
      <div>
        <ReviewsByUserID userId={userId} pagination={pagination}/>
      </div>
    </div>
  );
}
