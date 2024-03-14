import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { auth } from "../firebase";
import { AuthContext } from "../context API/AuthContext";
import Logout from "../images/logout.png";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Chit-Chat-City</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>
          {" "}
          <img src={Logout} alt="" />{" "}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
