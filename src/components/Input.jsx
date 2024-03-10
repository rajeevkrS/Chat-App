import React, { useContext, useState } from "react";
import Img from "../images/img.png";
import Attach from "../images/attach.png";
import { AuthContext } from "../context API/AuthContext";
import { ChatContext } from "../context API/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  let downloadURL;

  // Upload image function
  const handleImageUpload = async () => {
    try {
      const storageReference = ref(storage, `chats/${uuid()}`);

      await uploadBytes(storageReference, img);

      downloadURL = await getDownloadURL(storageReference);

      return downloadURL;
    } catch (error) {
      setError(true);
      console.log("Error uploading image");
    }
  };

  const handleSend = async () => {
    let uploadimageurl;

    // Check if their is any img or not, if not only text wil be sent
    if (img) {
      uploadimageurl = await handleImageUpload();

      //  arrayUnion() adds elements to an array that are not already present
      await updateDoc(doc(db, "chats", data.chatId), {
        // Update messages
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: downloadURL,
        }),
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // Update in the userChats collection of latest message for both the user
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);

    return;
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type here..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />

        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
