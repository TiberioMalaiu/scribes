import { useState, useMemo } from 'react';

export function usePagination(totalItems, itemsPerPage) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil((totalItems || 0) / (itemsPerPage || 25)),
    [totalItems, itemsPerPage]
  );

  const canGoNext = currentPage < totalPages;
  const canGoPrev = currentPage > 1;

  const goToPage = (page) => {
    const p = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(p);
  };

  const nextPage = () => canGoNext && setCurrentPage(prev => prev + 1);
  const prevPage = () => canGoPrev && setCurrentPage(prev => prev - 1);

  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage, totalPages, canGoNext, canGoPrev,
    goToPage, nextPage, prevPage, pageNumbers,
  };
}
