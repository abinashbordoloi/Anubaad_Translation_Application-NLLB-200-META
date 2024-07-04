import axios from "axios";
import uuid from "react-native-uuid";

export const translate = async (languageFrom, languageTo, inputText) => {
  console.log(languageFrom, languageTo, inputText);
  try {
    const response = await axios.post("http://192.168.124.107:5000/text-to-text", {
  
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
    console.log("Form Data:", formData);

    const response = await axios.post('http://192.168.124.107:5000/audio-to-text', formData, {
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


// export const translateSpeech = async (uri, sourceLanguage, targetLanguage) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', {
//       uri,
//       name: 'audio.mp3',
//       type: 'audio/mp3'
//     });

//     console.log('formData:', formData)
//     console.log('File URI:', uri)

//     formData.append('sourceLanguage', sourceLanguage);
//     formData.append('targetLanguage', targetLanguage);
//     formData.append("uri", uri)
//     //print the uri




    

//     const response = await axios.post('http://192.168.124.107:5000/speech-to-speech', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data', // Use 'multipart/form-data' for FormData
//       },
//     });

//     console.log('Speech-to-Speech Translation Response:', response.data);

//     if (response.data && response.data.translatedAudio && response.data.translatedText) {
//       return {
//         translatedAudio: response.data.translatedAudio,
//         translatedText: response.data.translatedText
//       };
//     } else {
//       throw new Error('Speech-to-Speech Translation failed: No result found');
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error('Speech-to-Speech Translation API error:', error.response.data);
//       throw new Error('Speech-to-Speech Translation failed: API error');
//     } else if (error.request) {
//       console.error('Network error:', error.request);
//       throw new Error('Speech-to-Speech Translation failed: Network error');
//     } else {
//       console.error('Speech-to-Speech Translation error:', error.message);
//       throw new Error('Speech-to-Speech Translation failed');
//     }
//   }
// };


// export const translateSpeech = async (uri, sourceLanguage, targetLanguage) => {
//   try {
//     console.log("Fetching file from URI:", uri);
//     const fileData = await fetch(uri);
//     const fileBlob = await fileData.blob();
//     console.log("File blob created", fileBlob);
//     // console.log("Source Language:", sourceLanguage);


//     const formData = new FormData();
//     formData.append('file', fileBlob, 'audio.mp3'); // Ensure correct name and filename
//     formData.append('sourceLanguage', sourceLanguage);
//     formData.append('targetLanguage', targetLanguage);
//     formData.append("uri", uri); // Remove this line if not needed by the server

//     console.log('FormData prepared with file, sourceLanguage, and targetLanguage.');
//     console.log('Sending FormData:', formData);
//     console.log('File Blob:', fileBlob);
//     console.log('Source Language:', sourceLanguage);
//     console.log('Target Language:', targetLanguage);

//     const response = await axios.post('http://192.168.124.107:5000/speech-to-speech', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log('Speech-to-Speech Translation Response:', response.data);

//     if (response.data && response.data.translatedAudio && response.data.translatedText) {
//       return {
//         translatedAudio: response.data.translatedAudio,
//         translatedText: response.data.translatedText
//       };
//     } else {
//       throw new Error('Speech-to-Speech Translation failed: No result found');
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error('Speech-to-Speech Translation API error:', error.response.data);
//       throw new Error('Speech-to-Speech Translation failed: API error');
//     } else if (error.request) {
//       console.error('Network error:', error.request);
//       throw new Error('Speech-to-Speech Translation failed: Network error');
//     } else {
//       console.error('Speech-to-Speech Translation error:', error.message);
//       throw new Error('Speech-to-Speech Translation failed');
//     }
//   }
// };


export const translateSpeech = async (file, sourceLanguage, targetLanguage) => {
  try {
    // Read the file as base64
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // Use Promise to wait for FileReader to load the file
    const uri = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });

    console.log('File read as base64:', uri);

    // Construct payload for the API request
    const payload = {
      uri,
      sourceLanguage,
      targetLanguage
    };

    // Make POST request using axios to your API endpoint
    const response = await axios.post('http://192.168.124.107:5000/speech-to-speech', payload);

    console.log('Speech-to-Speech Translation Response:', response.data);

    // Check response data for translatedAudio and translatedText fields
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

// export const whisper = async (uri) => {
//   try {
//     console.log("Fetching file from URI:", uri);
//     const fileData = await fetch(uri);
//     const fileBlob = await fileData.blob();
//     console.log("File blob created", fileBlob);

//     const formData = new FormData();
//     formData.append('file', {
//       uri: uri,
//       type: 'audio/mp3',
//       name: 'audio.mp3'
//     }); // Use the appropriate format for React Native


//     formData.append("uri", uri); // Remove this line if not needed by the server

//     console.log('FormData prepared with file, sourceLanguage, and targetLanguage.');
//     console.log('Sending FormData:', formData);

//     const response = await axios.post('http://192.168.124.107:5000/whisper', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     console.log('Whisper Translation Response:', response.data);

//     if (response.data && response.data.translatedAudio && response.data.translatedText) {
//       return {
//         translatedAudio
//       };
//     }
//   }

//   catch (error) {
//     if (error.response) {
//       console.error('Whisper Translation API error:', error.response.data);
//       throw new Error('Whisper Translation failed: API error');
//     } else if (error.request) {
//       console.error('Network error:', error.request);
//       throw new Error('Whisper Translation failed: Network error');
//     } else {
//       console.error('Whisper Translation error:', error.message);
//       throw new Error('Whisper Translation failed');
//     }
//   }

// }



