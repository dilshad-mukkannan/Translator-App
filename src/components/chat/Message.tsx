import { auth } from "../../utilities/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { MessageProps } from "./ChatBox";
import React from "react";

interface MessageComponentProps {
    message: MessageProps;
}



const Message: React.FC<MessageComponentProps> = ({message}) => {
    const [user] = useAuthState(auth);
    console.log("userid",user)
    console.log("messid:", message.id)
    const defaultImage = "https://img.icons8.com/?size=100&id=BFNnYNwK4Goo&format=png&color=000000"
  return (
    <div className={`chat-bubble ${message.uid === user?.uid ? "right": ""}`}>
      <img className="chat-bubble__left" src={message.avatar} alt="user avatar" onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = defaultImage;
  }}/>
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">
          {message.text}
        </p>
      </div>
    </div>
  );
};

export default Message;