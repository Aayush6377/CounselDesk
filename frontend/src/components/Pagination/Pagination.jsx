import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const Pagination = ({pagination, handlePageChange}) => {
    return (
        <>
            {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    onClick={() => handlePageChange(pagination.prevPage)}
                    disabled={!pagination.hasPrevPage}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-[var(--accent-color)] disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-[var(--primary-color)] hover:text-black transition-colors"
                >
                    <MdNavigateBefore size={24} />
                </button>


                <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`flex items-center justify-center w-10 h-10 rounded-full text-base font-semibold transition-colors ${
                                pagination.currentPage === page
                                    ? 'bg-[var(--primary-color)] text-black cursor-default' 
                                    : 'bg-black/30 text-[var(--accent-color)] hover:bg-white/20' 
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(pagination.nextPage)}
                    disabled={!pagination.hasNextPage}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 text-[var(--accent-color)] disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-[var(--primary-color)] hover:text-black transition-colors"
                >
                    <MdNavigateNext size={24} />
                </button>
            </div>
        )}
        </>
    );
}

export default Pagination;