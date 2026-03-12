import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <button 
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-slate-300 disabled:cursor-not-allowed" 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
      </button>
      
      {pages.map(page => (
        <button 
          key={page}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-all ${
            currentPage === page 
              ? 'bg-purple-600 border border-purple-500 text-white shadow-[0_4px_14px_rgba(138,43,226,0.3)]' 
              : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      <button 
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-slate-300 disabled:cursor-not-allowed" 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination;
