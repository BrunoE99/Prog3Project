import Image from "next/image";

interface MovieComponents {
  id: number;
  title: string;
  description: string;
  genre: string;
  release_date: Date;
  length: number;
  image_url: string;
  score: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  date: Date;
  level: number;
  imageURL: string;
  reviews: ReviewComponents[];
  deletedAt: Date;
  relatedGroups: GroupMembership[];
  comments: Comment[];
}

interface Group {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  relatedUsers: GroupMembership[];
  reviews: ReviewComponents[];
}

interface GroupMembership {
  id: number;
  user: User;
  group: Group;
  role: string;
}

interface Comment {
  id: number;
  content: string;
  userId: number;
  user: User;
  reviewId: number;
  review: ReviewComponents;
}

interface ReviewComponents {
  id: number;
  userId: number;
  texto: string;
  puntuacion: number;
  user: User;
  peliculaId: number;
  pelicula: MovieComponents;
  grupo: Group | undefined;
  comentarios: Comment[];
}

export default function MovieReview(review: ReviewComponents) {
  return (
    <div className="flex flex-col gap-3 p-5 bg-[#003566] px-2 py-2 m-3 rounded-sm shadow-lg w-full">
      <div className="flex flex-row gap-2">
        <Image
          className="rounded-full"
          src={review.user.imageURL}
          alt="User's Avatar"
          width={50}
          height={50}
        />
        <div className="p-2 flex flex-col w-full">
          <h3 className="text-2xl font-semibold">{review.user.username}</h3>
          <h4 className="text-sm font-medium opacity-60">
            {review.grupo?.name}
          </h4>
        </div>
        <div>
          <div className="text-md md:text-xl font-semibold flex justify-end w-full p-2">
            {review.puntuacion}/10
          </div>
          <div className="hidden md:flex justify-end w-full pr-2 m-0">
            {Array.from({ length: review.puntuacion }).map((_, index) => {
              return (
                <span
                  key={index}
                  className="fa fa-star checked text-[#f5c518] text-xl m-0.5 "
                ></span>
              );
            })}
          </div>
        </div>
      </div>
      <div className="text-sm p-2 pl-0 lg:pl-15 w-3/4 wrap-balanced md:text-base ">
        {review.texto}
      </div>
    </div>
  );
}
