import React, {FormEvent, useState} from "react";
import { auth, db } from "../../utilities/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface SendMessageProps {
    scroll: React.RefObject<HTMLSpanElement>;
}

const SendMessage: React.FC<SendMessageProps> = ({scroll}) => {
  const [message, setMessage] = useState("");

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() === "") {
        
        alert("Enter a valid message");
        return;
    }

    if (!auth.currentUser) {
        console.error("No authenticated user found");
        return;
    }

    const {uid, displayName, photoURL} = auth.currentUser;
    await addDoc(collection(db, "messages"), {
        text: message,
        name: displayName,
        avatar: photoURL,
        createdAt: serverTimestamp(),
        uid,
    });
    setMessage("");
    scroll.current?.scrollIntoView({behavior: "smooth"});
  }

  return (
    <form className="send-message" onSubmit={(event) => {sendMessage(event)}}>
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        value={message}
        onChange={(e) => {
            setMessage(e.target.value)
        }}
        className="form-input__input"
        placeholder="type message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;