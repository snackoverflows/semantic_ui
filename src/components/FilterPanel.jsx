import React, { useState } from 'react';

function FilterPanel({ filters, onFilterChange }) {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleCheckboxChange = (filterValue) => {
    let updatedFilters;
    if (selectedFilters.includes(filterValue)) {
      updatedFilters = selectedFilters.filter(f => f !== filterValue);
    } else {
      updatedFilters = [...selectedFilters, filterValue];
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
          {filters.map((filter, index) => (
            <div className="filter--group" key={index}>
              <h2 className="filter--panel__section-header">{filter.title}</h2>
              <div className="filter--inner filter--inner-visible">
                <ul className="menu-list">
                  {filter.options.map((option, optionIndex) => (
                    <li key={optionIndex}>
                      <div>
                        <label className="checkbox filterCheckbox">
                          <input
                            tabIndex="0"
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
