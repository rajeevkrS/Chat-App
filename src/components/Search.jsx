import React from "react";

const Search = () => {
  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder="Find User" />
      </div>
      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/20180718/pexels-photo-20180718/free-photo-of-taking-a-break.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
        />
        <div className="userChatInfo">
          <span>Jane</span>
        </div>
      </div>
    </div>
  );
};

export default Search;
