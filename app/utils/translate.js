

// import axios from 'axios';
// // import uuid from 'uuid'; // Import UUID library or use another method to generate UUIDs


// export const translate = async (languageFrom, languageTo,text) => {
//     console.log(languageFrom, languageTo, text);
//     console.log(typeof(text), typeof(languageFrom), typeof(languageTo));
//     try {
//         const response = await axios.post('http://192.168.1.25:5000/translate', {
//             sourceLanguage: languageFrom,
//             targetLanguage: languageTo,
//             inputText: text
//         });
//         console.log(response.data);
       
//         const  translation  = response.data;
       

//         if (translation && translation.result) {
//             // const id = uuid.v4();
//             const dateTime = new Date().toISOString();

//             const translationResult = {
//                 // id,
//                 dateTime,
//                 translated_text: translation.result,
//                 source: translation.source,
//                 target: translation.target,
//                 inferenceTime: translation.inference_time // Add other properties from the API response as needed
//             };
//             console.log(translationResult);
//             return translationResult;
            
//         } else {
//             throw new Error('Translation failed: No result found');
//         }
//     } catch (error) {
//         console.log('not connected');
//         console.error('Translation error:', error);
//         throw new Error('Translation failed');
//     }
// };

// // export default translate;

// // export const speechToSpeech = async (languageFrom, languageTo, audio) => {
// //     try {
// //         const response = await axios.post('http://127.0.0.1:5000/speech-to-speech', {
// //             sourceLanguage: languageFrom,
// //             targetLanguage: languageTo,
// //             audio
// //         }); 
      


import axios from "axios";
import uuid from "react-native-uuid";

export const translate = async (languageFrom, languageTo, text) => {
  console.log(languageFrom, languageTo, text);
  console.log(typeof text, typeof languageFrom, typeof languageTo);

  try {
    const response = await axios.post("http://192.168.1.23:5005/translate", {
      sourceLanguage: languageFrom,
      targetLanguage: languageTo,
      inputText: text,
    });

    const translation = response.data;

    if (translation && translation.result) {
      const id = uuid.v4(); // Use react-native-uuid for unique IDs
      const dateTime = new Date().toISOString();

      const translationResult = {
        id,
        dateTime,
        translated_text: translation.result,
        source: translation.source,
        target: translation.target,
        inferenceTime: translation.inference_time, // Add other properties as needed
      };

      console.log(translationResult);
      return translationResult;
    } else {
      throw new Error("Translation failed: No result found");
    }
  } catch (error) {
    if (error.response) {
      // Handle errors from the translation API (likely status code > 400)
      console.error("Translation API error:", error.response.data);
      throw new Error("Translation failed: API error");
    } else if (error.request) {
      // Handle network errors
      console.error("Network error:", error.request);
      throw new Error("Translation failed: Network error");
    } else {
      // Unexpected errors
      console.error("Translation error:", error.message);
      throw new Error("Translation failed");
    }
    }
}