import React, { useEffect, useState } from "react";
import translate from "../../utilities/translate";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";
import { AiOutlineAudio, AiOutlineTranslation } from "react-icons/ai";
import SelectDropDown from "../../atom/SelectDropdown";

const Translator: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [outputLn, setOutputLn] = useState("");
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(
    null
  );
  const [previousText, setPreviousText] = useState("");

  const languageArray = [
    "en",
    "es",
    "de",
    "fr",
    "hi",
    "id",
    "it",
    "ja",
    "ko",
    "nl",
    "pl",
    "pt",
    "ru",
    "zh",
  ];

  const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>([]);
  console.log(voices);

  useEffect(() => {
    setUtterance(new SpeechSynthesisUtterance(""));
  }, [outputLn]);

  const handleTranslate = async () => {
    let result;

    if (outputLn) {
      result = await translate(inputText, outputLn);
    } else {
      result = "Choose a Language First!";
    }
    if (result) {
      setOutputText(result);
      setPreviousText(inputText);
    }

    const availableVoices = voices?.filter(({ lang }) => {
      return lang.startsWith(outputLn);
    });

    const activeVoice =
      availableVoices?.find(({ name }) => name.includes("Google")) ||
      availableVoices?.find(({ name }) => name.includes("Luciana")) ||
      availableVoices?.[0];

    const u = new SpeechSynthesisUtterance(result);

    if (activeVoice) {
      u.voice = activeVoice;
    }

    setUtterance(u);
  };

  const handlePlay = () => {
    const synth = window.speechSynthesis;
    if (utterance) {
      utterance.onend = (event) => {
        console.log(
          `Utterance has finished after ${event.elapsedTime} seconds.`
        );
      };
    }
    if (utterance) {
      synth.speak(utterance);
    }
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();
  };

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    if (Array.isArray(voices) && voices.length > 0) {
      setVoices(voices);
      return;
    }
    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = function () {
        const voices = window.speechSynthesis.getVoices();
        setVoices(voices);
      };
    }
  }, []);

  async function handleOnRecord() {
    setInputText("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.start();

    recognition.onresult = async function (event) {
      const transcript = event.results[0][0].transcript;

      console.log("transcript", transcript);
      console.log("opln:", outputLn);

      setInputText(transcript);
      
    };
  }

  return (
    <div className="mx-auto h-full min-h-screen w-full flex flex-col justify-center bg-gradient-to-r from-indigo-500 to-purple-500 px-4">
      <div className="flex justify-center items-center mb-6 md:mb-8">
        <AiOutlineTranslation className="text-white text-4xl md:text-6xl mr-4" />
        <h1 className="text-white text-3xl md:text-4xl font-bold">
          AI Translator
        </h1>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 mb-6 md:mb-8">
        <SelectDropDown
          outputLn={outputLn}
          setOutputLn={setOutputLn}
          className="w-full md:w-1/4 border-2 border-gray-300 rounded-lg shadow-lg p-2 bg-white"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="w-full md:w-1/3 h-auto md:h-96 p-4 bg-white rounded-lg shadow-lg relative">
          <textarea
            className="border-2 border-gray-300 w-full h-full rounded-lg p-4 shadow-inner text-gray-700 resize-none"
            value={inputText}
            placeholder="Enter text to translate..."
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <button
            className={`absolute bottom-2 right-2 px-3 py-2 rounded-full shadow-lg transition ${
              inputText === previousText ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
            onClick={handleTranslate}
            disabled={inputText === previousText}
          >
            <AiOutlineTranslation className="inline-block mr-2" />
            Translate
          </button>
          <button
            onClick={handleOnRecord}
            className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-green-600 transition"
          >
            <AiOutlineAudio className="inline-block mr-2" />
            Speech
          </button>
        </div>

        <div className="w-full md:w-1/3 h-auto md:h-96 p-4 bg-white rounded-lg shadow-lg text-gray-700 flex items-center justify-center overflow-y-scroll">
          {outputText ? (
            <div className="p-3">{outputText}</div>
          ) : (
            <div className="text-gray-400">Translation will appear here...</div>
          )}
        </div>
      </div>

      {languageArray.includes(outputLn) && (
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlay}
            className="bg-blue-500 text-white p-4 md:p-6 rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            <FaPlay />
          </button>
          {/* <button
            onClick={handlePause}
            className="bg-yellow-500 text-white p-4 md:p-6 rounded-full shadow-lg hover:bg-yellow-600 transition"
          >
            <FaPause />
          </button> */}
          <button
            onClick={handleStop}
            className="bg-red-500 text-white p-4 md:p-6 rounded-full shadow-lg hover:bg-red-600 transition"
          >
            <FaStop />
          </button>
        </div>
      )}
    </div>
  );
};
export default Translator;
