import { onAuthStateChanged } from "firebase/auth";
import { Children, createContext, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

// Authentication provider, creating a user and then I am able to use that user inside every component in App.js file so that we can check if user is logged in or not and navigate accordingly.
export const AuthContextProvider = ({ children }) => {
  // At beggining no user.
  const [currentUser, setCurrentUser] = useState({});

  // Using useEffect hook, checking if there is any user or not.
  useEffect(() => {
    // Passing a firebase Auth funtion for checking
    const unsub = onAuthStateChanged(auth, (user) => {
      // If user
      setCurrentUser(user);
      console.log(user);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};
