'use client'

import { redirect } from "next/navigation"
import Button from "./button"
import { Movie } from "./reviewsection"
import Image from 'next/image'

export default function MovieCard({ pelicula, key, } : { pelicula: Movie, key: number }) {
    const clicked = () => redirect('/movie/' + pelicula.id)

    return (
        <div key={key} className="bg-[#003566] p-4 w=1/3 rounded-xl text-center">
            <h3 className="text-lg font-bold">{pelicula.nombre}</h3>
            <p>{pelicula.sinopsis}</p>
            <Image src={pelicula.urlImagen} alt="movie image" width="400" height="400" 
            style={{ width: "auto", height: "auto" }} 
            className="m-auto aspect-square mt-4 rounded-xl mb-3 !w-full" 
            // el ! es un parche, intentar fixear sin eso
            // buscar breakpoints devices y fixear cantidad de cards
            /> 
            <Button text="Read reviews" onClick={clicked}/>
        </div>
    )
}