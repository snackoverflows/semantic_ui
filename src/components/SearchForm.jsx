import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="form global-search-form">
      <div className="global-search-results-form row">
        <div className="float-container col-7 col-lg-10 col-md-8 col-sm-6 col-xs-6">
        <img className="search-icon" src="https://static-00.iconduck.com/assets.00/search-icon-2048x2048-cmujl7en.png" alt="Search" title="Search" style={{ width: '20px', height: '20px' }} />
          <label htmlFor="globalSearchInput">Search</label>
          <input
            className="col-11"
            type="text"
            id="globalSearchInput"
            name="search"
            autoComplete="off"
            value={query}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="button button-primary global-search-form__button">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchForm;
