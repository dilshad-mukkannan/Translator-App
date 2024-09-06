import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import translate from "../../utilities/translate";
import SelectDropDown from "../../atom/SelectDropdown";

const API_KEY = "AIzaSyC1ecYqWfsKLJgdnuucwQU5mZv_00Vd4WQ";

const ImageExtractor: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [transResult, setTransResult] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [outputLn, setOutputLn] = useState<string>("");

  const handleTranslation = async () => {
    const translation = await translate(result, outputLn);
  
    if (typeof translation === "string") {
      const transArr = [...translation];
      const joinedTransArray = transArr.join("");
      const itemsTransArray = joinedTransArray.split(",");
      const trimmedTransArray = itemsTransArray.map((item) => item.trim());
      setTransResult(trimmedTransArray);
      console.log("trimmedTransArray:", trimmedTransArray);
    } else {
      console.error("Translation failed or returned undefined.");
    }
  };
  
  useEffect(() => {
    if (imageFile) {
      classifyImage();
    }
  }, [imageFile]);

  useEffect(() => {
    if (result.length > 0) {
      handleTranslation();
    }
  }, [outputLn]);

  const classifyImage = async () => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        if (reader.result && typeof reader.result === "string") {
          const image = {
            inlineData: {
              data: reader.result.split(",")[1],
              mimeType: imageFile.type,
            },
          };

          const showImage = reader.result;
          setImagePreview(showImage);

          const prompt =
            "Extract the objects in the provided image and output them as comma separated, in the order they appear. There should be no usual space after each commas. Don't repeat similar items";
          const res = await model.generateContent([prompt, image]);
          const arr = [...res.response.text()];
          const joinedArray = arr.join("");
          const itemsArray = [...new Set(joinedArray.split(","))];
          const trimmedArray = itemsArray.map((item) => item.trim());
          console.log("trimmedArray:", trimmedArray);
          setResult(trimmedArray.toString());
        }
      };

      reader.readAsDataURL(imageFile);
    } catch (error) {
      console.error("Error classifying image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 justify-center">
      <div className="bg-[#ece2b1] rounded-lg shadow-lg p-8 w-full max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Image Extractor
        </h1>

        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-4"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
        {imageFile && (
        <SelectDropDown
          outputLn={outputLn}
          setOutputLn={setOutputLn}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300 mb-6"
        />
      )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {imagePreview && (
            <div className="flex items-center justify-center text-center">
              {outputLn && (
              <img
                src={imagePreview}
                alt="Image preview"
                className="max-w-full max-h-full object-cover rounded-lg shadow-md"
              />
            )}
            </div>
          )}

          {transResult.length > 0 && (
            <div className="overflow-y-auto max-h-96 p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Translated Result:
              </h2>
              <ul className="list-disc list-inside text-gray-600">
                {transResult.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageExtractor;
