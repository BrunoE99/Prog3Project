'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function MovieFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentFilter = searchParams.get('filter') || 'default';
    const currentOrder = searchParams.get('order') || 'asc';

    const getCurrent = () => {
        if (currentFilter === 'default') return 'default';
        return `${currentFilter}-${currentOrder}`
    }

    const filterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const params = new URLSearchParams(searchParams);

        if (value === 'default') {
            params.delete('filter');
            params.delete('order');
        } else {
            const [filter, order] = value.split('-');
            params.set('filter', filter);
            params.set('order', order);
        }

        router.push(`?${params.toString()}`);
    }

    return (
        <div className="bg-[#001d3d] p-6 rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label htmlFor="movie-filter" className="text-white text-lg font-semibold">
                    Sort & Filter:
                </label>
                <div className="relative">
                    <select id="movie-filter" value={getCurrent()} onChange={filterChange} className="appearance-none bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-700 cursor-pointer min-w-[220px]">
                        <option value="default">Default Order</option>
                        <option value="rating-asc">Rating (Low to High)</option>
                        <option value="rating-desc">Rating (High to Low)</option>
                        <option value="alphabetic-asc">Alphabetic (A-Z)</option>
                        <option value="alphabetic-desc">Alphabetic (Z-A)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}