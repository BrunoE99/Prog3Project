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
                <li><Link href="/about">About</Link></li>
            </ul>
            </div>
            <div>
            <h4 className="font-bold mb-2">Resources</h4>
            <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
            </ul>
            </div>
            {/* <div>
            <h4 className="font-bold mb-2">Follow Us</h4>
            <ul>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Facebook</a></li>
            </ul>
            </div> */}
        </div>
        </footer>
    )
}