
import React, { useState } from "react";
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
  outputLn?: string; 
  setOutputLn?: (value: string) => void; 
  onLanguageSelected?: () => void; 
  useRedux?: boolean;
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
      // If useRedux, Redux dispatch
      const userId = auth.currentUser?.uid;
      if (userId) {
        dispatch(setLanguagePreference({ userId, language: selectedLanguage }));
      }
      if (onLanguageSelected) {
        onLanguageSelected();
      }
    } else if (setOutputLn) {
      // Otherwise, setOutputLn 
      setOutputLn(selectedLanguage);
    }
  };

  return (
    <select
      className={className}
      onChange={handleChange}
      defaultValue=""
      
    >
      
      <option value='' disabled hidden>Translate</option>
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


