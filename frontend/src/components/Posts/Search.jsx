import { useState } from 'react';
import './Search.css';

function SearchBar() {
      const [query, setQuery] = useState('');
      const [users, setUsers] = useState([]);
      const [showSuggestions, setShowSuggestions] = useState(false);

      const handleSearch = async (e) => {
            const value = e.target.value;
            setQuery(value);

            if (value.trim().length >= 2) {
                  try {
                        const response = await fetch(`https://talk-project.onrender.com/talk/search/users?query=${encodeURIComponent(value)}`);
                        const data = await response.json();
                        console.log('Fetched Users:', data);
                        setUsers(data);
                        setShowSuggestions(data.length > 0);
                  } catch (error) {
                        console.error('Error fetching search results:', error);
                        setUsers([]);
                        setShowSuggestions(false);
                  }
            } else {
                  setUsers([]);
                  setShowSuggestions(false);
            }
      };

      return (
            <div className="main">
                  <div className="search-container p-4 relative">
                        <input
                              type="text"
                              id="search-bar"
                              className="search-bar w-full p-2 border rounded-md"
                              placeholder="Search"
                              autoComplete="off"
                              value={query}
                              onChange={handleSearch}
                        />
                        {showSuggestions && (
                              <div className="suggestions absolute top-full left-0 w-full bg-white border rounded-md shadow-lg">
                                    {users.length > 0 ? (
                                          users.map((user) => (
                                                <a key={user._id} href={`/user/${user._id}`} className="flex items-center p-2 hover:bg-gray-100">
                                                      <img src={user.profile} className="w-8 h-8 rounded-full mr-2" alt="Profile" />
                                                      <span>{user.username}</span>
                                                </a>
                                          ))
                                    ) : (
                                          <div className="p-2 text-gray-500">No results found</div>
                                    )}
                              </div>
                        )}
                  </div>
            </div>
      );
};

export default SearchBar;
