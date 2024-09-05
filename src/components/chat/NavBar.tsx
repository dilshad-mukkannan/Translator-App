import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png"
import { auth } from "../../utilities/firebase";
import {signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoChatbubbles } from "react-icons/io5";

const NavBar = () => {
    const [user] = useAuthState(auth);

    const googleSignIn = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider);
      console.log(user)
    };
  
    const signOut = () => {
      auth.signOut();
      console.log(user)
    };

    return (
        <nav className="nav-bar">
          <div className="flex gap-1 items-center">
          <span><IoChatbubbles/></span>
          <h1 className="">React Chat</h1>
          </div>
          {user ? (
            <button onClick={signOut} className="sign-out" type="button">
              Sign Out
            </button>
          ) : (
            <button className="sign-in">
              <img
                onClick={googleSignIn}
                src={GoogleSignin}
                alt="sign in with google"
                // type="button"
              />
            </button>
          )}
        </nav>
      );
    };
    
    export default NavBar;