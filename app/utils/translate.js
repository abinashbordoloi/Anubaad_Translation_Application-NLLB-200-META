

import axios from 'axios';
import uuid from 'uuid'; // Import UUID library or use another method to generate UUIDs

export const translate = async (languageFrom, languageTo,text) => {
    console.log(languageFrom, languageTo, text);
    console.log(typeof(text), typeof(languageFrom), typeof(languageTo));
    try {
        const response = await axios.post('http://127.0.0.1:5000/translate', {
            sourceLanguage: languageFrom,
            targetLanguage: languageTo,
            inputText: text
        });
        // console.log(response.data);
       
        const  translation  = response.data;
       

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
            console.log(translationResult);
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
