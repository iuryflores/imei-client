import React from "react";

function PagControls({ currentPage, totalPages, onPageChange }) {
  const handlePrevPage = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <div className="d-flex align-items-center">
      {currentPage === 1 ? null : (
        <i
          className="bi bi-arrow-left-square-fill fs-1"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        ></i>
      )}
      <div className="p-3">
        {currentPage} de {totalPages}
      </div>
      {currentPage === totalPages ? null : (
        <i
          className="bi bi-arrow-right-square-fill fs-1"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        ></i>
      )}
    </div>
  );
}

export default PagControls;
