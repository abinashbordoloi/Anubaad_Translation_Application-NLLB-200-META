import axios from "axios";
import uuid from "react-native-uuid";

export const translate = async (languageFrom, languageTo, inputText) => {
  console.log(languageFrom, languageTo, inputText);
  try {
    const response = await axios.post("http://192.168.94.107:5000/text-to-text", {
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

      const translationResult = {
        id,
        dateTime,
        inputText: inputText,
        translated_text: translation.translatedText,
        languageFrom,
        languageTo
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

export const transcribeAudio = async (uri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav'
    });

    const response = await axios.post('http://192.168.94.107:5000/audio-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Transcription Response:', response.data);

    if (response.data && response.data.transcription) {
      return response.data.transcription;
    } else {
      throw new Error('Transcription failed: No result found');
    }
  } catch (error) {
    if (error.response) {
      console.error('Transcription API error:', error.response.data);
      throw new Error('Transcription failed: API error');
    } else if (error.request) {
      console.error('Network error:', error.request);
      throw new Error('Transcription failed: Network error');
    } else {
      console.error('Transcription error:', error.message);
      throw new Error('Transcription failed');
    }
  }
};


export const translateSpeech = async (uri, sourceLanguage, targetLanguage) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'audio.wav',
      type: 'audio/wav'
    });

    console.log('File URI:', uri)
    

    formData.append('sourceLanguage', sourceLanguage);
    formData.append('targetLanguage', targetLanguage);
    formData.append("uri", uri)
    //print the uri




    

    const response = await axios.post('http://192.168.94.107:5000/speech-to-speech', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
      },
    });

    console.log('Speech-to-Speech Translation Response:', response.data);

    if (response.data && response.data.translatedAudio && response.data.translatedText) {
      return {
        translatedAudio: response.data.translatedAudio,
        translatedText: response.data.translatedText
      };
    } else {
      throw new Error('Speech-to-Speech Translation failed: No result found');
    }
  } catch (error) {
    if (error.response) {
      console.error('Speech-to-Speech Translation API error:', error.response.data);
      throw new Error('Speech-to-Speech Translation failed: API error');
    } else if (error.request) {
      console.error('Network error:', error.request);
      throw new Error('Speech-to-Speech Translation failed: Network error');
    } else {
      console.error('Speech-to-Speech Translation error:', error.message);
      throw new Error('Speech-to-Speech Translation failed');
    }
  }
};