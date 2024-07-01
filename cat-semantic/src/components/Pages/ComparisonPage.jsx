import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from '../Banner';
import SearchForm from '../SearchForm';
import ComparisonResults from '../ComparisonResults';

const ComparisonPage = () => {
  const [products1, setProducts1] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [products3, setProducts3] = useState([]);
  const [query, setQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowsPerPage = 10;
  const location = useLocation();

  useEffect(() => {
    document.body.style.zoom = '80%';
    return () => {
      document.body.style.zoom = '100%';
    };
  }, []);

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

  const parseXML = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const docs = Array.from(xmlDoc.getElementsByTagName("doc")).map(doc => {
      const getValue = (name) => {
        const el = Array.from(doc.getElementsByTagName("*")).find(tag => tag.getAttribute("name") === name);
        return el ? el.textContent : '';
      };
      return {
        title: getValue('title_t'),
        url: getValue('url'),
        thumbnail: getValue('image_search_results_s'),
        type: "N/A",
        subfamily_t: "N/A",
        text_orig: getValue('body_t'),
        score: "N/A"
      };
    });
    const numFound = xmlDoc.getElementsByTagName("result")[0]?.getAttribute("numFound") || 0;
    return {
      docs,
      numFound: parseInt(numFound, 10)
    };
  };

  const handleSearch = async (searchQuery, start = 0, fq = '') => {
    setLoading(true);
    const username = 'josue.vargas@accenture.com';
    const password = 'josue@LW01';
    const credentials = btoa(`${username}:${password}`);

    const endpoints = [
      `https://caterpillares-dev.b.lucidworks.cloud/api/apps/CAT/query/CAT?q=${searchQuery}&rows=${rowsPerPage}&start=${start}&fq=facet_doc_type:"Content Type%5EProducts"&fq=language:en_US&fq=doc_content_type: "Landing Page"`,
      `https://caterpillares-dev.b.lucidworks.cloud:443/api/apps/P3_Semantic_Search_POC/query/P3_Semantic_Search_POC?expand=true&fq=%7B%21collapse%20field%3Durl%7D&rows=${rowsPerPage}&start=${start}&q=${searchQuery}&fq=${fq}`,
      `https://caterpillares-dev.b.lucidworks.cloud:443/api/apps/P3_Semantic_Search_POC/query/P3_Semantic_Search_POC_B?expand=true&fq=%7B%21collapse%20field%3Durl%7D&rows=${rowsPerPage}&start=${start}&q=${searchQuery}&fq=${fq}`
    ];

    try {
      const responses = await Promise.all(endpoints.map(endpoint =>
        fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`
          },
          credentials: 'include'
        })
      ));

      const [response1, response2, response3] = responses;

      if (!response1.ok || !response2.ok || !response3.ok) {
        throw new Error('Error fetching data');
      }

      const data1 = parseXML(await response1.text());
      const data2 = await response2.json();
      const data3 = await response3.json();

      setProducts1(data1.docs);
      setProducts2(data2.response.docs);
      setProducts3(data3.response.docs);
      setTotalResults(data1.numFound);
      setCurrentFilters(data1.facet_counts ? data1.facet_counts.facet_fields.subfamily_s : []);
      setCurrentPage(start / rowsPerPage + 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handlePageChange = (pageNumber) => {
    const newStart = (pageNumber - 1) * rowsPerPage;
    handleSearch(query, newStart);
  };

  return (
    <div className="ComparisonPage">
      <Banner />
      <div className="auth global-search-results-page">
        <link rel="stylesheet" href="/base_min.css" type="text/css" />
        <link rel="stylesheet" href="/semantic.css" type="text/css" />
        <div className="container" style={{ maxWidth: "2000px" }}>
          <SearchForm initialQuery={query} onSearch={(searchQuery) => handleSearch(searchQuery, 0)} />
          <ComparisonResults 
            results1={products1} 
            results2={products2} 
            results3={products3} 
            totalResults={totalResults} 
            currentPage={currentPage} 
            rowsPerPage={rowsPerPage} 
            onPageChange={handlePageChange}
            currentFilters={currentFilters} 
            onFilterChange={(filters) => handleSearch(query, 0, filters)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
