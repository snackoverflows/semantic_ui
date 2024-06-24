import React, { useState, useEffect } from 'react';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';

const SearchResults = ({ results, totalResults, currentPage, rowsPerPage, onPageChange, currentFilters, onFilterChange, loading }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResults, setFilteredResults] = useState(results);
  const [showFullText, setShowFullText] = useState([]);

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter(result => selectedFilters.includes(result.subfamily_t)));
    }
  }, [selectedFilters, results]);

  useEffect(() => {
    setShowFullText(new Array(filteredResults.length).fill(false));
  }, [filteredResults]);

  const docs = filteredResults || [];

  const toggleShowFullText = (index) => {
    const updatedShowFullText = [...showFullText];
    updatedShowFullText[index] = !updatedShowFullText[index];
    setShowFullText(updatedShowFullText);
  };

  const mapCurrentFiltersToFilters = (currentFilters) => {
    const filterMap = {};

    for (let i = 0; i < currentFilters.length; i += 2) {
      const optionName = currentFilters[i];
      const count = currentFilters[i + 1];

      if (!filterMap['Subfamilies']) {
        filterMap['Subfamilies'] = { title: 'Subfamilies', options: [] };
      }
      filterMap['Subfamilies'].options.push({ value: optionName, name: optionName, label: optionName, count });
    }

    return Object.values(filterMap);
  };

  const structuredFilters = mapCurrentFiltersToFilters(currentFilters);

  const handleFilterChange = (selected) => {
    setSelectedFilters(selected);
    const fq = selected.map(filter => `subfamily_s:"${encodeURIComponent(filter)}"`).join(' OR ');
    onFilterChange(fq);
  };

  if (loading) {
    return (
      <div className="search-results-page-body">
        <div className="container">
          <div className="search-results-container">
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page-body">
      <div className="container">
        <div className="search-results-container row">
          <FilterPanel filters={structuredFilters} onFilterChange={handleFilterChange} />
          <div className="col-lg-8 col-md-12 col-sm-12 pfp-right-col">
            <Pagination 
              totalResults={totalResults} 
              currentPage={currentPage} 
              rowsPerPage={rowsPerPage} 
              onPageChange={onPageChange} 
            />
            <ul className="search-results-list">
              {docs.map((result, index) => (
                <li key={index} className="search-results-list__item" resultindex={index + 1}>
                  <a className="result-content" href={result.url}>
                    <div className="search-results-content__body row">
                      <div className="col-2">
                        <img className="result-content__img lazyloaded" data-src={result.thumbnail} alt={result.title} src={result.thumbnail} />
                      </div>
                      <div className="col-10 search-results-content-description">
                        <div className="search-results-content__title">{result.title}</div>
                        <p className="search-results-heading"><strong>Section Name:</strong> {result.type}</p> 
                        <p className="search-results-heading"><strong>Sub family: </strong> {result.subfamily_t}</p>
                        <p className="search-results-heading">
                          {!showFullText[index] ? result.text_orig : result.text_orig.substring(0, 100) + '...'}
                        </p>
                        <p className="search-results-links" role="link" tabIndex="0" style={{color: "#2679b8"}}>{result.url}</p>
                      </div>
                    </div>
                  </a>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="search-results-heading"><strong>Score: </strong> {result.score}</p> 
                    <button className="btn btn-link" onClick={() => toggleShowFullText(index)}>
                      {showFullText[index] ? 'View complete description' : 'Truncate description'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination 
              totalResults={totalResults} 
              currentPage={currentPage} 
              rowsPerPage={rowsPerPage} 
              onPageChange={onPageChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
