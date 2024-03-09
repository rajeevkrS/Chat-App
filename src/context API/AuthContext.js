import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
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
      setCurrentUser(user);
      // Only log `displayName` if the user exists
      // if (user) {
      //   console.log("From AuthContex.js :", user);
      // } else {
      //   console.log("No user is logged in");
      // }
    });

    // Cleanup subscription on unmount
    return () => {
      unsub();
    };
  }, []);

  // For sending multiple objects like displayName, photoURL, email, etc. we need to use double curly brackets "{{}}".
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
