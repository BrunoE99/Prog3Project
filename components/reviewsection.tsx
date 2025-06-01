import { movieByGenre } from "@/app/API/movies/route";
import Image from 'next/image'

export interface Movie {
    id: number;
    nombre: string;
    sinopsis: string;
    genero: string;
    fechaEstreno: string;
    duracion: number;
    urlImagen: any;
    calificacion: number;
}

function ReviewSection({
    title,
    movies,
}: {
    title: string;
    movies: Movie[];
}) {
    return (
        <div className="mb-10 bg-[#001d3d]">
            <h2 className="text-2xl font-semibold mb-4 p-5">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
                {movies.map((movie, index) => (
                    <div key={index} className="bg-[#003566] p-4 rounded shadow">
                        <h3 className="text-lg font-bold">{movie.nombre}</h3>
                        <p>{movie.sinopsis}</p>
                        <Image src={movie.urlImagen} alt="movie image" width="400" height="400"/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default async function AllReviews() {
    const peliculas = await movieByGenre("Drama");

    return (
        <section className="px-6 py-10 bg-[#003566]">
            <div className="max-w-6xl mx-auto">
                <ReviewSection
                    title="Películas Otaku"
                    movies={peliculas}
                />
            </div>
        </section>
    );
}