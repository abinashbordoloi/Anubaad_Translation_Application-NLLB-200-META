// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Button,
//   Image,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { Camera, AutoFocus } from 'expo-camera';
// import { RNTesseractOcr } from 'react-native-tesseract-ocr';
// import { MaterialIcons } from '@expo/vector-icons';
// import { useIsFocused } from '@react-navigation/native';

// export default function CameraComponent() {
//   const [hasCameraPermission, setHasCameraPermission] = useState(false);
//   const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
//   const [image, setImage] = useState(null);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const cameraRef = useRef(null);
//   const isFocused = useIsFocused();

//   const requestPermissions = async () => {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status === 'granted') {
//         setHasCameraPermission(true);
//       }
//     } catch (error) {
//       console.log('Error requesting media library permissions:', error);
//     }

//     try {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       if (status === 'granted') {
//         setHasCameraPermission(true);
//         setShowCamera(true);
//       }
//     } catch (error) {
//       console.log('Error requesting camera permissions:', error);
//     }
//   };

//   useEffect(() => {
//     requestPermissions();
//   }, []);

//   const takePicture = async () => {
//     if (isCameraReady && cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         setImage(photo.uri);
//         processImage(photo.uri);
//         setShowCamera(false);
//       } catch (error) {
//         console.log('Error taking picture:', error);
//       }
//     } else {
//       console.log('Camera is not ready');
//     }
//   };

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setImage(result.uri);
//       processImage(result.uri);
//       setShowCamera(false); // Hide the camera view after picking an image
//     }
//   };

//   const switchCameraType = () => {
//     setCameraType(
//       cameraType === Camera.Constants.Type.back
//         ? Camera.Constants.Type.front
//         : Camera.Constants.Type.back
//     );
//   };

//   const processImage = async (uri) => {
//     try {
//       const tesseractOptions = {};
//       const recognizedText = await RNTesseractOcr.recognize(
//         uri,
//         'LANG_ENGLISH',
//         tesseractOptions
//       );

//       if (recognizedText) {
//         setRecognizedText(recognizedText);
//       }
//     } catch (error) {

//       console.log('Error recognizing text:', error);
//       setRecognizedText('Error recognizing text.');
//     }
//   };

//   const takeAgain = () => {
//     setImage(null);
//     setRecognizedText('');
//     setShowCamera(true);
//   };

//   return (
//     <View style={styles.container}>
//       {showCamera && isFocused && hasCameraPermission && (
//         <Camera
//           style={styles.camera}
//           type={cameraType}
//           ref={cameraRef}
//           autoFocus={AutoFocus.on}
//           onCameraReady={() => setIsCameraReady(true)}
//         >
//           <View style={styles.buttonContainer}>
//             <View style={styles.button}>
//               <Button title="Take Picture" onPress={takePicture} />
//             </View>
//             <View style={styles.button}>
//               <Button title="Pick Image" onPress={pickImage} />
//             </View>
//           </View>
//         </Camera>
//       )}
//       {/* Display captured image */}
//       {image && (
//         <View style={styles.imagePreviewContainer}>
//           <Image source={{ uri: image }} style={styles.imagePreview} />
//           <TouchableOpacity style={styles.takeAgainButton} onPress={takeAgain}>
//             <Text style={styles.takeAgainText}>Take Again</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       {/* Display recognized text */}
//       {recognizedText !== '' && <Text>{recognizedText}</Text>}
//       {/* Switch camera button */}
//       <TouchableOpacity
//         style={styles.switchCameraButton}
//         onPress={switchCameraType}
//       >
//         <MaterialIcons name="switch-camera" size={24} color="white" />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'flex-end',
//     marginBottom: 20,
//   },
//   button: {
//     margin: 10,
//   },
//   imagePreviewContainer: {
//     flex: 1,
//   },
//   imagePreview: {
//     flex: 1,
//   },
//   takeAgainButton: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   takeAgainText: {
//     color: 'blue',
//     fontWeight: 'bold',
//   },
//   switchCameraButton: {
//     position: 'absolute',
//     top: 20,
//     right: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: 30,
//     padding: 10,
//   },
// });

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, AutoFocus } from "expo-camera";
import { RNTesseractOcr } from "react-native-tesseract-ocr";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import * as FileSystem from "expo-file-system";

export default function CameraComponent() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();


  const requestPermissions = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        setHasCameraPermission(true);
      }
    } catch (error) {
      console.log("Error requesting media library permissions:", error);
    }

    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasCameraPermission(true);
        setShowCamera(true);
      }
    } catch (error) {
      console.log("Error requesting camera permissions:", error);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const processImageWithGoogleVision = async (image) => {
    try {
      if (!image) {
        alert("Please select an image first.");
        return;
      }

      const apiKey = 'AIzaSyDXgy5w3UrpiwmPropG80pgWj95-prazNs'; // Replace with your Google Cloud Vision API key
      const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      const base64ImageData = FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const requestData = {
        image: {
          content: base64ImageData,
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      };
      const apiResponse = await axios.post(apiURL, requestData);
      setLabels(apiResponse.data.responses[0].textAnnotations[0].description);
    } catch (error) {
      console.log("Error recognizing text with Google Vision API:", error);
      setRecognizedText("Error recognizing text.");
    }
  };

  const processImage = async (uri) => {
    try {
      await processImageWithGoogleVision(uri);
    } catch (error) {
      console.log("Error processing image:", error);
      setRecognizedText("Error recognizing text.");
    }
  };

  const takePicture = async () => {
    if (isCameraReady && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        setImage(photo.uri);
        processImage(photo.uri);
        console.log("fnknsdnknl: ", photo.uri);
        setShowCasmera(false);
      } catch (error) {
        console.log("Error taking picture:", error);
      }
    } else {
      console.log("Camera is not ready");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("3:", result.assets[0].uri);
      setImage(result.assets[0].uri);
      processImage(result.assets[0].uri);
      setShowCamera(false); // Hide the camera view after picking an image
    }
  };

  const switchCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  // const processImage = async (uri) => {
  //   try {
  //     console.log("ifff")
  //     const processed = await MlkitOcr.detectFromFile(uri);
  //     console.log('Processed: Elsee', processed);

  //     if (processed && processed.text) {
  //       const recognizedText = processed.text;
  //       console.log('Recognized Text:', recognizedText);
  //       setRecognizedText(recognizedText);
  //     } else {
  //       console.log('Text not found or processed object is invalid.');
  //       setRecognizedText('Error recognizing text.');
  //     }
  //   } catch (error) {
  //     console.log('Error recognizing text:', error);
  //     setRecognizedText('Error recognizing text.');
  //   }
  // };

  const takeAgain = () => {
    setImage(null);
    setRecognizedText("");
    setShowCamera(true);
  };

  return (
    <View style={styles.container}>
      {showCamera && isFocused && hasCameraPermission && (
        <Camera
          style={styles.camera}
          type={cameraType}
          ref={cameraRef}
          autoFocus={AutoFocus.on}
          onCameraReady={() => setIsCameraReady(true)}
        >
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Take Picture" onPress={takePicture} />
            </View>
            <View style={styles.button}>
              <Button title="Pick Image" onPress={pickImage} />
            </View>
          </View>
        </Camera>
      )}
      {/* Display captured image */}
      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.takeAgainButton} onPress={takeAgain}>
            <Text style={styles.takeAgainText}>Take Again</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Display recognized text */}
      {recognizedText !== "" && <Text>{recognizedText}</Text>}
      {/* Switch camera button */}
      <TouchableOpacity
        style={styles.switchCameraButton}
        onPress={switchCameraType}
      >
        <MaterialIcons name="switch-camera" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
    margin: 10,
  },
  imagePreviewContainer: {
    flex: 1,
  },
  imagePreview: {
    flex: 1,
  },
  takeAgainButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  takeAgainText: {
    color: "blue",
    fontWeight: "bold",
  },
  switchCameraButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 30,
    padding: 10,
  },
});
