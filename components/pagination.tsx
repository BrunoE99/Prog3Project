'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Button from './button';

interface PaginationProps {
    currentPage: number;
    hasMovies: boolean;
}

export default function Pagination({ currentPage, hasMovies }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.delete('page');
        params.set('page', pageNumber.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between p-3">
            <div>
                {(
                    <Button text={`← Previous Page`} onClick={() => page(currentPage - 1)} disabled={currentPage <= 0}/>
                )}
            </div>

            <div>
                Page {currentPage}
            </div>

            <div>
                {hasMovies && (
                    <Button text={`Next Page →`} onClick={() => page(currentPage + 1)}/>
                )}
            </div>
        </div>
    );
}