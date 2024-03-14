import React, { useContext, useState } from "react";
import Img from "../images/img.png";
// import Attach from "../images/attach.png";
import { AuthContext } from "../context API/AuthContext";
import { ChatContext } from "../context API/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
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
  let uploadimageurl;

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
    // Check if text is empty
    if (text.trim() === "" && !img) {
      return;
    }

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
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Check if the selected file is an image
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setImg(selectedFile);
    } else {
      alert("Please select an image file.");
    }
  };

  // Conditionally render input fields and button based on whether user is selected for chat
  return data.user.uid ? (
    <div className="input">
      <input
        type="text"
        placeholder="Type here..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={handleFileChange}
        />
        <label htmlFor="file" className="fileInputLabel">
          <div className="fileInputContainer">
            {img ? (
              <img src={URL.createObjectURL(img)} alt="Selected avatar" />
            ) : (
              <img src={Img} alt="" />
            )}
          </div>
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  ) : (
    <div className="input">
      <p className="initialRender">
        Please select your friend to start the chat.
      </p>
    </div>
  );
};

export default Input;
