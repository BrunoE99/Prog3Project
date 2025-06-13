import React from 'react';
import Link from 'next/link';
import MovieCard from './movieCard';
import { getAllGenres } from '@/app/API/genres/route';
import { movieByGenre } from '@/app/API/movie/route';
import { redirect } from 'next/navigation';

interface Genre {
  id: number;
  nombre: string;
}

export interface Movie {
    id: number;
    nombre: string;
    sinopsis: string;
    genero: number;
    fechaEstreno: string;
    duracion: number;
    urlImagen: any;
    calificacion: number;
}

interface GenreShowcaseProps {
  className?: string;
  moviesPerGenre?: number;
}

const GenreCard: React.FC<GenreShowcaseProps> = async ({ 
  className = '',
  moviesPerGenre = 4 
}) => {
  try {
    const genres: Genre[] = await getAllGenres();
    
    const genreMoviesPromises = genres.map(async (genre) => {
      try {
        // console.log(genre);
        const movies = await movieByGenre(genre.nombre, 0);
        // console.log(movies);
        return {
          genre,
          movies: movies.movies.slice(0, moviesPerGenre)
        };
      } catch (error) {
        console.error(`Failed to get movies for genre ${genre.nombre}:`, error);
        return {
          genre,
          movies: []
        };
      }
    });

    const genreMoviesData = await Promise.all(genreMoviesPromises);

    return (
      <div className={`space-y-8 ${className}`}>
        <h2 className="text-3xl font-bold my-6 text-center">Movies by Genres</h2>
        
        {genreMoviesData.map(({ genre, movies }) => (
          <div key={genre.id} className="bg-[#021f3b] rounded-lg shadow-lg p-6 mx-3">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">{genre.nombre}</h3>
              <Link href={`/genres/${encodeURIComponent(genre.nombre)}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                View all {genre.nombre} movies
              </Link>
            </div>

            {movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie: Movie) => (
                  <MovieCard key={movie.id} pelicula={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No movies available for this genre yet.</p>
              </div>
            )}
          </div>
        ))}
        
        {genres.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No genres available at the moment.</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error getting genres and movies:', error);
    return (
      <div className={`text-center text-red-600 p-8 ${className}`}>
        <p>Failed to load genres and movies..</p>
      </div>
    );
  }
};

export default GenreCard;