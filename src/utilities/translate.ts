import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC1ecYqWfsKLJgdnuucwQU5mZv_00Vd4WQ";
const translate = async(inputText:string, outputLn:string, newPrompt = '') => {

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      let prompt;

      if (newPrompt) {
        prompt = `Please analyze the "${inputText}" and provide a summary as a short paragraph in  ${outputLn}`
      } else {

        prompt = `Please translate the text "${inputText}" into ${outputLn} (language code: ${outputLn}). 
        
      If the text appears to be gibberish and cannot be translated, attempt to transliterate it into ${outputLn}.
      
      If the text cannot be translated or transliterated, please return the text exactly as it is. Strictly Ensure that the output is exactly the translated text, transliterated text, or the original text. No exxplanations needed.`;
      }
      
        const result = await model.generateContent([prompt]);
        // setOutputText(result.response.text());
        return result.response.text();
      

      
    } catch (error) {
      console.error("Error classifying image:", error);
    }
}
  ;

export default translate;