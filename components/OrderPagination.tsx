"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderPaginationProps {
  totalPages: string;  
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setLimit?: React.Dispatch<React.SetStateAction<number>>; 
}

const OrderPagination: React.FC<OrderPaginationProps> = ({
  totalPages,
  currentPage,
  setCurrentPage,
  setLimit
}) => {
  const totalPagesNumber = parseInt(totalPages, 10) || 1; // Convert string to number safely

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const alwaysVisible = 4; 

    if (totalPagesNumber <= alwaysVisible + 1) {
      for (let i = 1; i <= totalPagesNumber; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= alwaysVisible - 1) {
        for (let i = 2; i <= alwaysVisible; i++) {
          pages.push(i);
        }
        pages.push("...");
      } else if (currentPage < totalPagesNumber - 2) {
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        if (currentPage + 1 < totalPagesNumber - 1) {
          pages.push("...");
        }
      } else {
        pages.push("...");
        for (let i = totalPagesNumber - 3; i < totalPagesNumber; i++) {
          pages.push(i);
        }
      }

      pages.push(totalPagesNumber);
    }

    return pages;
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === "number") {
      setCurrentPage(page);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPagesNumber) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center font-semibold ${
              page === currentPage
                ? "bg-red-100 text-red-700"
                : typeof page === "number"
                ? "text-gray-600 hover:bg-gray-100"
                : "cursor-default"
            }`}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPagesNumber}
          className={`p-2 rounded-md ${
            currentPage === totalPagesNumber ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Items Per Page Selection */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600 text-sm mr-32 whitespace-nowrap">
          Show result:
        </span>
        <select
            onChange={(e) => setLimit && setLimit(Number(e.target.value))} // Call only if defined
            className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >

          {[6, 10, 20, 30, 40, 50].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default OrderPagination;
