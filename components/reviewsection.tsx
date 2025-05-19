interface ReviewComponents {
    title: string;
    movies: { title: string; review: string }[];
}

function ReviewSection({ title, movies }: ReviewComponents) {
    return (
        <div className="mb-10 bg-[#001d3d]">
            <h2 className="text-2xl font-semibold mb-4 p-5">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
                {movies.map((movie, index) => (
                    <div key={index} className="bg-[#003566] p-4 rounded shadow">
                        <h3 className="text-lg font-bold">{movie.title}</h3>
                        <p>{movie.review}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function AllReviews() {
    const dummyData = [
        {
        title: 'Action Movies',
        movies: [
            { title: 'Mad Max: Fury Road', review: 'Lots of cars and explosions i think.' },
            { title: 'John Wick', review: 'I would do the same for my dog.' },
            { title: 'Gladiator', review: 'My name is Maximus Decimus Meridius.' },
        ],
        },
        {
        title: 'Anime Movies',
        movies: [
            { title: 'One Piece: Film Red', review: 'First time we see Shanks fighting in +20 years.' },
            { title: 'Ghibli Studio', review: 'Every movie is a fucking masterpiece.' },
            { title: 'Jujutsu Kaisen 0', review: 'Gojo did not have to do the black man like that.'},
        ],
        },
        {
        title: 'I do not know more movies',
        movies: [
            { title: 'Pirates of the caribean', review: 'Fucking gold.' },
            { title: 'Pirates of the caribean 2', review: 'Really good follow-up.' },
            { title: 'Pirates of the caribean 3', review: 'Theyre gonna make a lot more right?'},
        ],
        }
    ]

    return (
        <section className="px-6 py-10 bg-[#003566]">
            <div className="max-w-6xl mx-auto">
                {dummyData.map((theme, index) => (
                    <ReviewSection key={index} title={theme.title} movies={theme.movies} />
                ))}
            </div>
        </section>
    )
}