import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { AuthContext } from "../context API/AuthContext";

const Chats = () => {
  // Fetch user and chats from firestore db
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);

  // Using onShnapshot() method of firebase will return realtime chats.
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  console.log(Object.entries(chats));

  return (
    <div className="chats">
      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/20180718/pexels-photo-20180718/free-photo-of-taking-a-break.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
        />
        <div className="userChatInfo">
          <span>Jane</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
};

export default Chats;
