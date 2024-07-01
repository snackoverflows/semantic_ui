import React, { useState, useEffect } from 'react';

function FilterPanel({ filters, selected, onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    setSelectedFilters(selected);
  }, [selected]);

  const handleCheckboxChange = (filterValue) => {
    const updatedFilters = [...selectedFilters];
    if (updatedFilters.includes(filterValue)) {
      updatedFilters.splice(updatedFilters.indexOf(filterValue), 1);
    } else {
      updatedFilters.push(filterValue);
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
    onFilterChange([]);
  };

  return (
    <div className="col-lg-4 col-md-12 col-sm-12 pfp-left-col">
      <div className="filter--panel">
        <div className="filter--panel__body">
          <div className="filter--panel__header">
            <h4 className="filter-by-heading">Filter By</h4>
            <a
              tabIndex="-1"
              className="clear-all"
              disabled={selectedFilters.length === 0}
              onClick={handleClearAll}
            >
              Clear All
            </a>
          </div>
          {filters.map((filterGroup, index) => (
            <div className="filter--group" key={index}>
              <h2 className="filter--panel__section-header">{filterGroup.title}</h2>
              <div className="filter--inner filter--inner-visible">
                <ul className="menu-list">
                  {filterGroup.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <div>
                        <label className="checkbox filterCheckbox">
                          <input
                            type="checkbox"
                            checked={selectedFilters.includes(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                          />
                          {option.label} ({option.count})
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterPanel;
