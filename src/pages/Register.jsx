// import "./style.scss";
import AddAvatar from "../images/addAvatar.png";

export const Register = () => {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit Chat</span>
        <span className="title">Register</span>

        <form>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add an avatar!</span>
          </label>

          <button>Sign Up</button>
        </form>

        <p>You do have an account? Login</p>
      </div>
    </div>
  );
};

export default Register;
