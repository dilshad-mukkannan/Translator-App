import { useState } from 'react'
import Loader from '../../atom/Loader'

import NavBar from './NavBar'
import ChatBox from './ChatBox'
import Welcome from './Welcome'

import { auth } from '../../utilities/firebase'
import { useAuthState } from "react-firebase-hooks/auth";

import SelectDropDown from '../../atom/SelectDropdown'
import { useAppSelector } from '../../store/hooks'

import Modal from "./Modal"


function Chat() {
  const [user, loading] = useAuthState(auth);
  const userId = auth.currentUser?.uid;
  const preferredLanguage = useAppSelector((state) => state.language?.preferences?.[userId ?? ""]);
  const [languageSelected, setLanguageSelected] = useState(!(!preferredLanguage));
  const [isModalOpen, setIsModalOpen] = useState(true);

  console.log(languageSelected)
  console.log(preferredLanguage)
  console.log(!(!preferredLanguage))

  const handleLanguageSelected = () => {
    setLanguageSelected(!(!preferredLanguage));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="Chat">
        <NavBar />
        {!user ? (
          <Welcome />
        ) : !languageSelected && !preferredLanguage ? (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold mb-4 text-center">Please select your preferred language</h2>
          <SelectDropDown onLanguageSelected={handleLanguageSelected} useRedux={true} className='w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-2'/>
        </Modal>
        ) : (
          <ChatBox />
        )}
      </div>
    </>
  );
}

export default Chat;