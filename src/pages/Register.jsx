import AddAvatar from "../images/addAvatar.png";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export const Register = () => {
  const [err, setError] = useState(false);

  //Handle Submit Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // console.log(res);

      //Create a unique image name
      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        (err) => {
          // Handle unsuccessful uploads
          setError(true);
          console.log("---", err.message);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Update the user
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            // console.log(downloadURL);

            // firestore db setup
            await setDoc(doc(db, "users", res.user.email), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
          });
        }
      );
      // console.log("---------------", uploadTask);
    } catch (err) {
      setError(true);
      console.log("***********", err.message);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit Chat</span>
        <span className="title">Register</span>

        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add an avatar!</span>
          </label>

          <button>Sign Up</button>

          {err && <h3>Something went wrong!</h3>}
        </form>

        <p>You do have an account? Login</p>
      </div>
    </div>
  );
};

export default Register;
