import React, { useState } from 'react';

const Pagination = ({ totalResults, currentPage, rowsPerPage, onPageChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const totalPages = Math.ceil(totalResults / rowsPerPage);

  const handlePrevPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li key={i} className={currentPage === i ? 'pag-page-selector' : 'pag-page-selector pagerPages'}>
          <a href="#" onClick={(e) => { e.preventDefault(); onPageChange(i); }}>Page {i}</a>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination--results">
      <hr />
      <div className="pagination__numbered-wrapper">
        <span className="pagination__numbered-items">
          {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, totalResults)} of {totalResults} Results
        </span>
        <div className="pagination__numbered-dropdowns">
          <nav className="page-flipper">
            <ul>
              <li><a className="page-flipper__button page-flipper__button--prev" href="#" onClick={handlePrevPage}>Previous</a></li>
              <li className="page-flipper__select-wrapper">
                <div className="drop--menu pagination__menu">
                  <a className={`dropdown-button ${dropdownOpen ? 'open' : ''}`} href="#" onClick={toggleDropdown}>Page {currentPage} of {totalPages}</a>
                  <ul className={`menu--content ${dropdownOpen ? 'open' : ''}`} role="menu">
                    {renderPageNumbers()}
                  </ul>
                </div>
              </li>
              <li><a className="page-flipper__button page-flipper__button--next" href="#" onClick={handleNextPage}>Next</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
