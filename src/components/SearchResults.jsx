import React, { useState, useEffect } from 'react';
import FilterPanel from './FilterPanel';
import Pagination from './Pagination';

const SearchResults = ({ results, totalResults, currentPage, rowsPerPage, onPageChange, currentFilters, onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResults, setFilteredResults] = useState(results);

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredResults(results);
    } else {
      setFilteredResults(results.filter(result => selectedFilters.includes(result.subfamily_t)));
    }
  }, [selectedFilters, results]);

  const docs = filteredResults || [];

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
                        <p className="search-results-heading">{result.id.split("!")[1]}</p> 
                        <p className="search-results-heading"><strong>Section Name:</strong> {result.type}</p> 
                        <p className="search-results-heading"><strong>Sub family: </strong> {result.subfamily_t}</p>
                        <p className="search-results-heading">{truncateText(result.text_orig, 300)}</p>
                        <p className="search-results-links" role="link" tabIndex="0" style={{color: "#2679b8"}}>{result.url}</p>
                      </div>
                    </div>
                  </a>
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
