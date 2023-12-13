// export const translate = async (text, languageFrom, languageTo) => {
//     const axios = require("axios");

//     const options = {
//     method: 'GET',
//     url: 'https://nlp-translation.p.rapidapi.com/v1/translate',
//     params: {text: text, to: languageTo, from: languageFrom},
//     headers: {
//         'X-RapidAPI-Key': '7fb15711b0mshdcf75f9ebce235ep112814jsne23cb9110ba4',
//         'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
//     }
//     };

//     const response = await axios.request(options).catch(function (error) {
//         console.error(error);
//     });

//     if (response.status !== 200) {
//         console.log(response);
//         throw new Error("Translate call failed. Response status: " + response.status);
//     }

//     return response.data;
// // }

// import axios from 'axios';

// export const translate = async (text, languageFrom, languageTo) => {
//     try {
//         const response = await axios.post('http://192.168.1.4:5000/translate', {
//             sourceLanguage: languageFrom,
//             targetLanguage: languageTo,
//             inputText: text
//         });

//         const { result } = response.data;

//         if (result) {
//             const id = uuid.v4();
//             const dateTime = new Date().toISOString();

//             const translationResult = {
//                 id,
//                 dateTime,
//                 result // Add other properties from the API response as needed
//             };

//             return translationResult;
//         } else {
//             throw new Error('Translation failed: No result found');
//         }
//     } catch (error) {
//         console.log('not connected')
//         console.error('Translation error:', error);
//         throw new Error('Translation failed');
//     }
// };


import axios from 'axios';
import uuid from 'uuid'; // Import UUID library or use another method to generate UUIDs

export const translate = async (languageFrom, languageTo,text) => {
    console.log(languageFrom, languageTo, text);
    console.log(typeof(text), typeof(languageFrom), typeof(languageTo));
    try {
        const response = await axios.post('http://192.168.1.4:5000/translate', {
            sourceLanguage: languageFrom,
            targetLanguage: languageTo,
            inputText: text
        });
        // console.log(response.data);
       
        const  translation  = response.data;
        console.log(translation);

        if (translation && translation.result) {
            const id = uuid.v4();
            const dateTime = new Date().toISOString();

            const translationResult = {
                id,
                dateTime,
                translated_text: translation.result,
                source: translation.source,
                target: translation.target,
                inferenceTime: translation.inference_time // Add other properties from the API response as needed
            };

            return translationResult;
        } else {
            throw new Error('Translation failed: No result found');
        }
    } catch (error) {
        console.log('not connected');
        console.error('Translation error:', error);
        throw new Error('Translation failed');
    }
};
