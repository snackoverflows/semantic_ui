import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import Banner from "./components/Banner";
import ComparisonPage from './components/Pages/ComparisonPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/comparison" element={<ComparisonPage />} />
      </Routes>
    </Router>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const handleSearch = (query) => {
    navigate('/results', { state: { query } });
  };

  return (
    <div className="HomePage">
      <link rel="stylesheet" href="/base_min.css" type="text/css" />
      <link rel="stylesheet" href="/semantic.css" type="text/css" />
      <Banner />
      <div className="auth global-search-results-page">
        <div className="container">
          <SearchForm onSearch={handleSearch} />
        </div>
      </div>
    </div>
  );
};

const ResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 16;
  const location = useLocation();

  useEffect(() => {
    const stateQuery = location.state?.query || '';
    if (stateQuery) {
      setQuery(stateQuery);
      handleSearch(stateQuery);
    } else {
      const params = new URLSearchParams(location.search);
      const searchQuery = params.get('query');
      if (searchQuery) {
        setQuery(searchQuery);
        handleSearch(searchQuery);
      }
    }
  }, [location.search, location.state]);

  const handleSearch = async (searchQuery, start = 0, fq = '') => {
    setLoading(true);
    const username = 'josue.vargas@accenture.com';
    const password = 'josue@LW01';
    const credentials = btoa(`${username}:${password}`);

    try {
      const endpoint = `https://caterpillares-dev.b.lucidworks.cloud:443/api/apps/P3_Semantic_Search_POC/query/P3_Semantic_Search_POC?expand=true&fq=%7B%21collapse%20field%3Durl%7D&rows=${rowsPerPage}&start=${start}&q=${searchQuery}&fq=${fq}`
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const data = await response.json();

      setProducts(data.response.docs);
      setTotalResults(data.response.numFound);
      setCurrentFilters(data.facet_counts.facet_fields.subfamily_s || []);
      setQuery(searchQuery);
      setCurrentPage(start / rowsPerPage + 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    const newStart = (pageNumber - 1) * rowsPerPage;
    handleSearch(query, newStart, selectedFilters.map(filter => `subfamily_s:"${encodeURIComponent(filter)}"`).join(' OR '));
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    handleSearch(query, 0, filters.map(filter => `subfamily_s:"${encodeURIComponent(filter)}"`).join(' OR '));
  };

  return (
    <div className="ResultsPage">
      <Banner />
      <div className="auth global-search-results-page">
        <link rel="stylesheet" href="/base_min.css" type="text/css" />
        <link rel="stylesheet" href="/semantic.css" type="text/css" />
        <div className="container">
          <SearchForm initialQuery={query} onSearch={(searchQuery) => handleSearch(searchQuery, 0)} />
          {loading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          ) : (
            <SearchResults 
              results={products} 
              totalResults={totalResults} 
              currentPage={currentPage} 
              rowsPerPage={rowsPerPage} 
              onPageChange={handlePageChange}
              currentFilters={currentFilters} 
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
