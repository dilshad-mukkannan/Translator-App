import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png"
import { auth } from "../../utilities/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { IoChatbubbles } from "react-icons/io5";

const Welcome = () => {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
      
  };

  return (
    <main className="welcome">
      <div className="welcome-content flex flex-col items-center w-10/12 sm:w-[40%]">
        <h2>Welcome to React Chat</h2>
        <IoChatbubbles size={60} className="-mt-4"/>
        <p className="mt-3 pt-5">Sign in with Google to chat with your fellow React Developers.</p>
        <button className="sign-in -mt-4">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt="Sign in with Google"
          />
        </button>
      </div>
    </main>
  );
  
};

export default Welcome;