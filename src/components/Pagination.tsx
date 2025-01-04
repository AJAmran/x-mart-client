export const Pagination = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
  }: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    return (
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`mx-1 px-3 py-1 rounded-md ${
              currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };
  