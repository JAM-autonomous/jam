import React from 'react';

function Search({ keyword, setKeyword }) {
  return (
    <div className="seach">
      <input className="keyword" type="text" placeholder="Search your friend" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </div>
  )
}

export default Search;