import React from "react";

const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">Chit Chat</span>
      <div className="user">
        <img
          src="https://images.pexels.com/photos/20180718/pexels-photo-20180718/free-photo-of-taking-a-break.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
        />
        <span>John</span>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
