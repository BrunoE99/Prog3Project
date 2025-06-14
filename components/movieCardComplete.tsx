'use client'

import { redirect } from "next/navigation"
import { Movie, MovieWithReviews } from "./reviewsection"
import Image from 'next/image'

export default function MovieCardFull({ pelicula, key, }: { pelicula: MovieWithReviews, key: number }) {
    const clicked = () => redirect('/movie/' + pelicula.id)

    return (
        <div key={key} className="grid grid-cols-3 bg-[#003566] p-4 rounded-xl text-center">
            <div className="justify-self-center">
                <Image src={pelicula.urlImagen} alt="movie image" width="500" height="500"
                    style={{ width: "auto", height: "auto" }}
                    className="m-auto aspect-square mt-4 rounded-xl mb-3 !w-full"
                // el ! es un parche, intentar fixear sin eso
                // buscar breakpoints devices y fixear cantidad de cards
                />
            </div>
            <div className="col-span-2 grid grid-rows-3">
                <h3 className="text-lg font-bold">{pelicula.nombre}</h3>
                <p>{pelicula.sinopsis}</p>
                <div className="flex justify-between items-end">
                    <span className="text-[#f5c518] text-xl m-1">⭐{pelicula.calificacion}</span>
                    <button 
                    className="rounded-xl py-2 px-4 border border-transparent text-center text-sm text-white transition-all 
                    shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none 
                    disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none bg-[#001d3d] 
                    w-full sm:w-auto md:w-[25%] h-12 min-h-auto md:h-15 justify-self-center" type="button"
                    onClick={clicked}>
                        <span className="hidden sm:inline">Details and reviews</span>
                        <span className="sm:hidden">Details</span>
                    </button>
                    <span className="text-white text-xl m-1">💬{pelicula.reviewCount}</span>
                </div>
            </div>
            {/* <Button text="Read reviews" onClick={clicked} /> */}
        </div>
    )
}