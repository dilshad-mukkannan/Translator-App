// import React from "react";
// import languageList from "../atom/language.json";

// type Language = {
//   name: string;
// };

// type LanguageList = {
//   [key: string]: Language;
// };

// interface SelectDropdownProps {
//   outputLn: string;
//   setOutputLn: (value: string) => void;
// }

// const languages: LanguageList = languageList as LanguageList;

// const SelectDropDown: React.FC<SelectDropdownProps> = ({
//   outputLn,
//   setOutputLn,
// }) => {
//   return (
//     <select
//       className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-6"
//       onChange={(e) => {
//         setOutputLn(e.target.value);
//         console.log("otpln:", outputLn);
//       }}
//     >
//       {" "}
//       <option>Translate</option>
//       {Object.keys(languages).map((key, index) => {
//         const language = languages[key];
//         return (
//           <option key={index + 118} value={key}>
//             {language.name}
//           </option>
//         );
//       })}
//     </select>
//   );
// };
// export default SelectDropDown;


import React from "react";
import languageList from "../atom/language.json";
import { useDispatch } from "react-redux";
import { setLanguagePreference } from "../features/language/languageSlice";
import { auth } from "../utilities/firebase";

type Language = {
  name: string;
};

type LanguageList = {
  [key: string]: Language;
};

interface SelectDropdownProps {
  outputLn?: string; // Optional, for the case where you need to manage outputLn state
  setOutputLn?: (value: string) => void; // Optional, for the case where you need to manage outputLn state
  onLanguageSelected?: () => void; // Optional, for the case where you need to notify that language is selected
  useRedux?: boolean; // Flag to determine whether to use Redux or not
  className?: string
}

const languages: LanguageList = languageList as LanguageList;

const SelectDropDown: React.FC<SelectDropdownProps> = ({
  outputLn,
  setOutputLn,
  onLanguageSelected,
  useRedux = false,
  className,
}) => {
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = e.target.value;

    if (useRedux) {
      // If useRedux is true, we assume the Redux dispatch logic is needed
      const userId = auth.currentUser?.uid;
      if (userId) {
        dispatch(setLanguagePreference({ userId, language: selectedLanguage }));
      }
      if (onLanguageSelected) {
        onLanguageSelected();
      }
    } else if (setOutputLn) {
      // Otherwise, use the setOutputLn callback
      setOutputLn(selectedLanguage);
    }
  };

  return (
    <select
      className={className}
      onChange={handleChange}
    >
      <option>Translate</option>
      {Object.keys(languages).map((key, index) => {
        const language = languages[key];
        return (
          <option key={index + 118} value={key}>
            {language.name}
          </option>
        );
      })}
    </select>
  );
};

export default SelectDropDown;


"w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-2"

// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import languageList from "../atom/language.json";
// import { setLanguagePreference } from "../features/language/languageSlice";
// import { auth } from "../utilities/firebase";

// type Language = {
//   name: string;
// };

// type LanguageList = {
//   [key: string]: Language;
// };

// interface SelectDropdownProps {
//   outputLn?: string; // Optional, for the case where you need to manage outputLn state
//   setOutputLn?: (value: string) => void; // Optional, for the case where you need to manage outputLn state
//   onLanguageSelected?: () => void; // Optional, for the case where you need to notify that language is selected
//   useRedux?: boolean; // Flag to determine whether to use Redux or not
// }

// const languages: LanguageList = languageList as LanguageList;

// const SelectDropDown: React.FC<SelectDropdownProps> = ({
//   outputLn,
//   setOutputLn,
//   onLanguageSelected,
//   useRedux = false,
// }) => {
//   const dispatch = useDispatch();
//   const [query, setQuery] = useState<string>("");
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
    
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleInputClick = () => {
//     setIsOpen(true); // Open the dropdown when input is clicked
//   };

//   const handleChange = (selectedLanguage: string | null) => {
//     if (!selectedLanguage) return;

//     if (useRedux) {
//       const userId = auth.currentUser?.uid;
//       if (userId) {
//         dispatch(setLanguagePreference({ userId, language: selectedLanguage }));
//       }
//       if (onLanguageSelected) {
//         onLanguageSelected();
//       }
//     } else if (setOutputLn) {
//       setOutputLn(selectedLanguage);
//     }
//   };

//   const selectOption = (key: string) => {
//     setQuery(() => languages[key].name);
//     handleChange(key);
//     setIsOpen(false); // Close the dropdown after selecting an option
//   };

//   const getDisplayValue = () => {
//     if (query) return query;
//     return "";
//   };

//   const filterOptions = (languages: LanguageList) => {
//     return Object.keys(languages).filter(
//       (key) =>
//         languages[key].name.toLowerCase().indexOf(query.toLowerCase()) > -1
//     );
//   };

//   return (
//     <div className="dropdown" ref={dropdownRef}>
//       <div className="control">
//         <div className="selected-value">
//           <input
//             type="text"
//             value={getDisplayValue()}
//             name="searchTerm"
//             onChange={(e) => {
//               setQuery(e.target.value);
//               handleChange(null); // Reset the selected language when the query changes
              
//             }}
//             onClick={handleInputClick}
//             className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-2"
//             placeholder="Translate"
//           />
//         </div>
//         <div className={`arrow ${isOpen ? "open" : ""}`}></div>
//       </div>

//       {isOpen && (
//         <div className={`options open`}>
//           {filterOptions(languages).map((key) => (
//             <div
//               onClick={() => selectOption(key)}
//               className={`option ${
//                 key === outputLn ? "selected" : ""
//               } bg-white text-gray-900 py-2 px-4 hover:bg-gray-200 cursor-pointer`}
//               key={key}
//             >
//               {languages[key].name}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SelectDropDown;
