import React, { useContext, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context API/AuthContext";

const Search = () => {
  const [username, setUsername] = useState(""); //searching the user
  const [user, setUser] = useState(null); // actual user
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  //create a "firebase query() function" to find the user with condition that displayName == userName
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // If there is any user
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  //
  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  // When clicked on the found User
  const handleSelect = async () => {
    // Check whether the chats collection in firestore is exits, if not the create new chats collection

    // Combining the UID so that they can chat with each other
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      //
      const res = await getDoc(doc(db, "chats", combinedId));
      // console.log(res.exists());
      // if their is no chats between the users inside chats collection, then creating a new chats collection.
      // exists() is a firebase method which helps in finding
      if (!res.exists()) {
        // create empty chat in chats collection in firestore
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // console.log(res.exists());

        // Create user chats using nested updateDoc function of firebase:

        // currentUser updateDoc function
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          // variable + string together
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          // serverTimestamp() is a firebase method which gives current date & time instead of implement Date.now()
          [combinedId + ".date"]: serverTimestamp(),
        });

        // user updateDoc function
        await updateDoc(doc(db, "userChats", user.uid), {
          // variable + string together
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          // serverTimestamp() is a firebase method which gives current date & time instead of implement Date.now()
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      // console.log("1st:" + user.email);
      // console.log("2nd:" + currentUser.email);
      // console.log("From Search.js: " + res);
    } catch (err) {}

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find eg. Demo"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
          value={username}
        />
      </div>

      {err && <span>No Result!</span>}

      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
