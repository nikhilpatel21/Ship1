import React, { useState, useEffect } from "react";

function DebounceSearchBar() {
  const [query, setQuery] = useState(""); 
  const [results, setResults] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  
  function debouncedSearch (searchQuery) {

    setIsLoading(true); // before api call true kiya

    fetch(`https://679c753b87618946e6524190.mockapi.io/api/v1/search/users?search=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setResults(data);
          } else {
            setResults([]); 
          }
       
        setIsLoading(false); //after we get data so false 
      })
      .catch((err) => {
        setError("Error fetching data");
        setResults([]);
        setIsLoading(false);
      });
  };

  
  useEffect(() => {
    if (query) {
      const timer = setTimeout(() => {
        debouncedSearch(query);
      }, 500); 

      return () => {
        clearTimeout(timer); 
      };
    } else {
      setResults([]); 
    }
  }, [query]); 

  return (
    <div className="max-w-2xl mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="Search users..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isLoading && <p className="mt-4 text-gray-500">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <ul className="mt-4 space-y-4">
        {results.map((user) => (
          <li key={user.id} className="flex items-center space-x-4 p-2 border-b border-gray-200">
           
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
             
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DebounceSearchBar;
