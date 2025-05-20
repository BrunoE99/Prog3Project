import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#000814] text-white px-6 py-8 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 gap-6">
            <div>
            <h4 className="font-bold mb-2">Pages</h4>
            <ul>
                <li><Link href="/reviews">Reviews</Link></li>
                <li><Link href="/genres">Genres</Link></li>
                <li><Link href="/about">About us</Link></li>
            </ul>
            </div>
            <div>
            <h4 className="font-bold mb-2">Resources</h4>
            <ul>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Report bugs</a></li>
            </ul>
            </div>
        </div>
        </footer>
    )
}