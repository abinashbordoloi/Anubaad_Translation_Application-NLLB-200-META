import axios from "axios";
import uuid from "react-native-uuid";

export const translate = async (languageFrom, languageTo, inputText) => {
  console.log(languageFrom, languageTo, inputText);
  try {
    const response = await axios.post("http://192.168.18.107:5000/text-to-text", {
      
      inputText: inputText,
      sourceLanguage: languageFrom,
      targetLanguage: languageTo

    });

    console.log("API Response:", response.data);

    const translation = response.data;
    console.log("Translation:", translation);

    if (translation && translation.translatedText) {
      const id = uuid.v4();
      const dateTime = new Date().toISOString();

      // const translationResult = {
      //   id,
      //   dateTime,
      //   translated_text: translation.result,
      //   source: translation.source,
      //   target: translation.target,
      //   inferenceTime: translation.inference_time,
      // };

      const translationResult ={
        id,
        dateTime,
        inputText: inputText,
        translated_text:translation.translatedText

      };

      console.log("Translation Result:", translationResult);
      return translationResult;
    } else {
      throw new Error("Translation failed: No result found");
    }
  } catch (error) {
    if (error.response) {
      console.error("Translation API error:", error.response.data);
      throw new Error("Translation failed: API error");
    } else if (error.request) {
      console.error("Network error:", error.request);
      throw new Error("Translation failed: Network error");
    } else {
      console.error("Translation error:", error.message);
      throw new Error("Translation failed");
    }
  }
};

// export const distranslate = async ( languageTo, inputText) => {
//   console.log(languageTo, inputText);
//   try {
//     const response = await axios.post("http://192.168.18.107:5000/dictionary", {
      
//       inputText: inputText,
//       targetLanguage: languageTo

//     });
    
//     console.log("API Response:", response.data);

//     const translation = response.data;
//     console.log("Translation:", translation);

//     if (translation && translation.translatedText) {
//       const id = uuid.v4();
//       const dateTime = new Date().toISOString();

//       // const translationResult = {
//       //   id,
//       //   dateTime,
//       //   translated_text: translation.result,
//       //   source: translation.source,
//       //   target: translation.target,
//       //   inferenceTime: translation.inference_time,
//       // };

//       const translationResult ={
//         id,
//         dateTime,
//         inputText: inputText,
//         translated_text:translation.translatedText