import React, { useState, useEffect } from 'react';

const ComparisonResults = ({ results1, results2, results3, totalResults, currentPage, rowsPerPage, onPageChange, currentFilters, onFilterChange, loading }) => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResults1, setFilteredResults1] = useState(results1);
  const [filteredResults2, setFilteredResults2] = useState(results2);
  const [filteredResults3, setFilteredResults3] = useState(results3);
  const [showFullText, setShowFullText] = useState([]);

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredResults1(results1);
      setFilteredResults2(results2);
      setFilteredResults3(results3);
    } else {
      setFilteredResults1(results1.filter(result => selectedFilters.includes(result.subfamily_t)));
      setFilteredResults2(results2.filter(result => selectedFilters.includes(result.subfamily_t)));
      setFilteredResults3(results3.filter(result => selectedFilters.includes(result.subfamily_t)));
    }
  }, [selectedFilters, results1, results2, results3]);

  useEffect(() => {
    setShowFullText(new Array(filteredResults1.length + filteredResults2.length + filteredResults3.length).fill(false));
  }, [filteredResults1, filteredResults2, filteredResults3]);

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

  const renderResultItem = (result, index, baseIndex) => (
    <div className="result-item" key={baseIndex + index}>
      <a className="result-content" href={result.url}>
        <div className="search-results-content__body row">
          <div className="col-2">
            <img className="result-content__img lazyloaded" data-src={result.thumbnail} alt={result.title} src={result.thumbnail} />
          </div>
          <div className="col-10 search-results-content-description">
            <div className="search-results-content__title">{result.title}</div>
            <p className="search-results-heading"><strong>Section Name:</strong> {result.type}</p>
            <p className="search-results-heading"><strong>Sub family:</strong> {result.subfamily_t}</p>
            <p className="search-results-heading">
              {showFullText[baseIndex + index] ? result.text_orig : result.text_orig.substring(0, 100) + '...'}
            </p>
            <p className="search-results-links" role="link" tabIndex="0" style={{ color: "#2679b8" }}>{result.url}</p>
          </div>
        </div>
      </a>
      <div className="d-flex justify-content-between align-items-center">
        <p className="search-results-heading"><strong>Score:</strong> {result.score}</p>
        <button className="btn btn-link" onClick={() => toggleShowFullText(baseIndex + index)}>
          {!showFullText[baseIndex + index] ? 'View complete description' : 'Truncate description'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="search-results-page-body">
      <div className="container" style={{ maxWidth: "2000px" }}>
        {loading ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="search-results-container" id="compare-results-container">
            <div className="column">
              <h2>Keyword Search</h2>
              {filteredResults1.map((result, index) => renderResultItem(result, index, 0))}
            </div>
            <div className="column">
              <h2>Semantic Search (Baseline)</h2>
              {filteredResults2.map((result, index) => renderResultItem(result, index, filteredResults1.length))}
            </div>
            <div className="column">
              <h2>Semantic Search (Finetuned)</h2>
              {filteredResults3.map((result, index) => renderResultItem(result, index, filteredResults1.length + filteredResults2.length))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonResults;
