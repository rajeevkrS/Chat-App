import AddAvatar from "../images/addAvatar.png";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export const Register = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  // const [imageUrl, setImageUrl] = useState(null);
  const [displayName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [image, setImage] = useState(null);
  const [avatarURL, setAvatarURL] = useState(null);
  const [loading, setLoading] = useState(false);
  let downloadURL;

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Set the avatar URL to preview the selected image
    const imageURL = URL.createObjectURL(selectedImage);
    setAvatarURL(imageURL);
  };

  // Upload image function
  const handleImageUpload = async () => {
    try {
      const storageReference = ref(storage, `userProfile/${displayName}`);

      await uploadBytes(storageReference, image);

      downloadURL = await getDownloadURL(storageReference);

      // setImageUrl(downloadURL);
      // console.log("image uploaded succesfully");
      // console.log(downloadURL);
      // console.log(imageUrl);
      return downloadURL;
    } catch (error) {
      setError(true);
      console.log("Error uploading image");
      // return null;
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Make sure displayName is populated before proceeding
    if (!displayName) {
      setError(true);
      return;
    }

    // first upload image to get image url
    let uploadimageurl;

    if (image) {
      uploadimageurl = await handleImageUpload();
    }

    if (!uploadimageurl) {
      setError(true);
      return;
    }

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // update currentUser on Authentication on Firebase
      await updateProfile(auth.currentUser, {
        displayName: displayName,
        photoURL: downloadURL,
      });

      // console.log("00000000000" + auth.currentUser);

      // Firestore DB setup

      //create users collection on firestore
      const userDocRef = doc(db, "users", email);
      await setDoc(userDocRef, {
        uid: res.user.uid,
        displayName: displayName,
        email: email,
        photoURL: downloadURL,
      });

      console.log("From Register.js: " + displayName);

      //create empty userChats collection on firestore
      const chatDocRef = doc(db, "userChats", res.user.uid);
      await setDoc(chatDocRef, {});

      // After all successfull operation, navigate to home page
      navigate("/");
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log("uploading failed");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit Chat</span>
        <span className="title">Register</span>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
          />

          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={handleImageChange}
          />
          {/* <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>{fileName}</span>
          </label> */}

          <label htmlFor="file" className="avatarLabel">
            <div className="avatarContainer">
              {avatarURL ? (
                <img src={avatarURL} alt="Selected avatar" />
              ) : (
                <img src={AddAvatar} alt="" />
              )}
            </div>
            <span>{avatarURL ? "Change avatar" : "Add an avatar"}</span>
          </label>

          <button>Sign Up</button>

          {loading && "Uploading and compressing the image please wait..."}

          {error && <h3>Something went wrong!</h3>}
        </form>

        <p>
          You do have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const displayName = e.target[0].value;
//   const email = e.target[1].value;
//   const password = e.target[2].value;
//   const file = e.target[3].files[0];

//   try {
//     //Create user
//     const res = await createUserWithEmailAndPassword(auth, email, password);
//     // console.log(res);

//     //Create a unique image name
//     const storageRef = ref(storage, displayName);

//     const uploadTask = uploadBytesResumable(storageRef, file);

//     // Register three observers:
//     // 1. 'state_changed' observer, called any time the state changes
//     // 2. Error observer, called on failure
//     // 3. Completion observer, called on successful completion
//     uploadTask.on(
//       (err) => {
//         // Handle unsuccessful uploads
//         setError(true);
//         console.log("---", err.message);
//       },
//       () => {
//         // Handle successful uploads on complete
//         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
//           // Update the user
//           await updateProfile(res.user, {
//             displayName,
//             photoURL: downloadURL,
//           });
//           // console.log(downloadURL);

//           try {
//             // firestore db setup

//             await addDoc(doc(db, "users", res.user.email), {
//               uid: res.user.uid,
//               displayName,
//               email,
//               // photoURL: downloadURL,
//             });

//             //create empty user chats on firestore
//             await addDoc(doc(db, "userChat", res.user.email), {});

//             // After all successfull operation, navigate to home page
//             setTimeout(async () => {
//               navigate("/");
//             }, 4000);
//           } catch (error) {
//             setError(true);
//             console.log("***********", err.message);
//           }
//         });
//       }
//     );
//     // console.log("---------------", uploadTask);
//   } catch (err) {
//     setError(true);
//     console.log("***********", err.message);
//   }
// };
