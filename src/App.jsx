import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Banner from "./components/Banner";

const App = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState([]);
  const rowsPerPage = 16;

  const handleSearch = async (query, start = 0, fq = '') => {
    const username = 'josue.vargas@accenture.com';
    const password = 'josue@LW01';
    const credentials = btoa(`${username}:${password}`);

    try {
      const response = await fetch(`https://caterpillares-dev.b.lucidworks.cloud:443/api/apps/P3_Semantic_Search_POC/query/P3_Semantic_Search_POC?expand=true&fq=%7B%21collapse%20field%3Durl%7D&rows=${rowsPerPage}&start=${start}&q=${query}&fq=${fq}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const data = await response.json();

      console.log(data)
      setProducts(data.response.docs);
      setTotalResults(data.response.numFound);
      setCurrentFilters(data.facet_counts.facet_fields.subfamily_s);
      console.log(currentFilters);
      setQuery(query);
      setCurrentPage(start / rowsPerPage + 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    const newStart = (pageNumber - 1) * rowsPerPage;
    handleSearch(query, newStart);
  };

  return (
    <div className="App">
      <Banner />
      <div className="auth global-search-results-page">
        <link rel="stylesheet" href="/base_min.css" type="text/css" />
        <link rel="stylesheet" href="/semantic.css" type="text/css" />
        <div className="container">
          <SearchForm onSearch={(query) => handleSearch(query, 0)} />
          <SearchResults 
            results={products} 
            totalResults={totalResults} 
            currentPage={currentPage} 
            rowsPerPage={rowsPerPage} 
            onPageChange={handlePageChange}
            currentFilters={currentFilters} 
            onFilterChange={(filters) => handleSearch(query, 0, filters)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
