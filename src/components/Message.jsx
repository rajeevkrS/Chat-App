import React from "react";
// import { AuthContext } from "../context API/AuthContext";
// import { ChatContext } from "../context API/ChatContext";

const Message = ({ message }) => {
  // console.log(message);

  // const { currentUser } = useContext(AuthContext);
  // const { data } = useContext(ChatContext);

  return (
    <div className="message owner">
      <div className="messageInfo">
        <img
          src="https://images.pexels.com/photos/20180718/pexels-photo-20180718/free-photo-of-taking-a-break.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>Hello</p>
        <img
          src="https://images.pexels.com/photos/20180718/pexels-photo-20180718/free-photo-of-taking-a-break.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt=""
        />
      </div>
    </div>
  );
};

export default Message;
