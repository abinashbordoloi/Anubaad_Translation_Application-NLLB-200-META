

import { firebase } from "../config/firebase";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import colors from "../utils/colors";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Button, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { performOCR } from "../utils/ocr";

export default function CameraComponent() {
  const [facing, setFacing] = useState('back');
  const [image, setImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  console.log("cameraPermission: ", cameraPermission)
  console.log("requestCameraPermission: ", requestCameraPermission)

  const requestPermissions = async () => {
    try {
      if (!cameraPermission || !cameraPermission.granted) {
        <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        {/* <Button onPress={cameraPermission} title="grant permission" /> */}
        cameraPermission();
      </View>
      }
      if (cameraPermission && cameraPermission.granted) {
        setShowCamera(true);
      }
    } catch (error) {
      console.log("Error requesting permissions:", error);
    }
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      processImage(result.uri);
      setShowCamera(false);
    }
  };

  const takePicture = async () => {
    if (isCameraReady && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
        processImage(photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.log("Error taking picture:", error);
      }
    } else {
      console.log("Camera is not ready");
    }
  };

  const takeAgain = () => {
    setImage(null);
    setRecognizedText("");
    setShowCamera(true);
  };

  const MAX_IMAGE_SIZE = 1024 * 1024;
  const checkAndResizeImage = async (imageUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo || !fileInfo.uri) {
        throw new Error("Invalid file information");
      }
      const { size } = fileInfo;
      if (size < MAX_IMAGE_SIZE) {
        return imageUri;
      }
      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      return resizedImage.uri;
    } catch (error) {
      console.log("Error checking and resizing image:", error);
      throw new Error("Error checking and resizing image: " + error.message);
    }
  };

  const uploadImageToFirebase = async (imageUri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo || !fileInfo.uri) {
        throw new Error("Invalid file information");
      }
      const uri = fileInfo.uri;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const ref = firebase.storage().ref().child(`images/${filename}`);

      const snapshot = await ref.put(blob);

      blob.close();

      const imageURL = await ref.getDownloadURL();
      return imageURL;
    } catch (error) {
      console.log("Error uploading image to Firebase Storage:", error);
      throw new Error(
        "Error uploading image to Firebase Storage: " + error.message
      );
    }
  };

  const processImage = async (uri) => {
    try {
      const resizedImageUri = await checkAndResizeImage(uri);
      const uploadedImageUrl = await uploadImageToFirebase(resizedImageUri);
      const result = await performOCR(uploadedImageUrl);

      const parsedText = result.ParsedResults[0]?.ParsedText;

      if (parsedText && parsedText.length > 0) {
        setRecognizedText(parsedText);
      } else {
        setRecognizedText("No text found.");
      }
    } catch (error) {
      console.log("Error recognizing text:", error);
      setRecognizedText("Error recognizing text.");
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  if (cameraPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Requesting permissions...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermissions} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showCamera && isFocused && (
        <CameraView
          style={styles.camera}
          type={facing}
          ref={cameraRef}
          // autoFocus={Camera.Constants.AutoFocus.on}
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
        </CameraView>
      )}

      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.takeAgainButton} onPress={takeAgain}>
            <Text style={styles.takeAgainText}>Take Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.resultContainer}>
        <Text style={styles.recognizedText}>{recognizedText}</Text>
      </View>

      <TouchableOpacity
        style={styles.switchCameraButton}
        onPress={toggleCameraFacing}
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
    backgroundColor: "lightblue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  takeAgainText: {
    color: "blue",
    fontWeight: "bold",
  },
  iconContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  recognizedText: {
    alignSelf: "center",
    marginVertical: 10,
    fontSize: 16,
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
  resultContainer: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 90,
    paddingVertical: 15,
  },
});









// import { firebase } from "../config/firebase";
// import * as FileSystem from "expo-file-system";
// import * as ImageManipulator from "expo-image-manipulator";
// import colors from "../utils/colors";
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   View,
//   Button,
//   Image,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Clipboard,
// } from "react-native";

// import * as ImagePicker from "expo-image-picker";

// import { MaterialIcons } from "@expo/vector-icons";
// import { useIsFocused } from "@react-navigation/native";
// import { performOCR } from "../utils/ocr"; // Assuming this is correctly imported
// import * as MediaLibrary from 'expo-media-library';

// import Camera from "expo-camera";
// import CameraType from "expo-camera";

// export default function CameraComponent() {
//   const [hasCameraPermission, setHasCameraPermission] = useState(null);
//   const [cameraType, setCameraType] = useState(CameraType.back);
//   const [image, setImage] = useState(null);
//   const [recognizedText, setRecognizedText] = useState("");
//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const cameraRef = useRef(null);
//   const isFocused = useIsFocused();

//   const [cameraPermission, requestCameraPermission] = Camera.useCameraPermissions();
//   const [mediaLibraryPermission, requestMediaPermission] = MediaLibrary.usePermissions();

//   useEffect(() => {
//     const requestPermissions = async () => {
//       if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
//         const cameraPermissionResult = await requestCameraPermission();
//         const mediaLibraryPermissionResult = await requestMediaPermission();

//         if (
//           cameraPermissionResult.granted &&
//           mediaLibraryPermissionResult.granted
//         ) {
//           setHasCameraPermission(true);
//           setShowCamera(true);
//         } else {
//           setHasCameraPermission(false);
//         }
//       } else {
//         setHasCameraPermission(true);
//         setShowCamera(true);
//       }
//     };

//     requestPermissions();
//   }, [cameraPermission, mediaLibraryPermission]);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled) {
//       setImage(result.uri);
//       processImage(result.uri);
//       setShowCamera(false);
//     }
//   };

//   const takePicture = async () => {
//     if (isCameraReady && cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         setImage(photo.uri);
//         processImage(photo.uri);
//         setShowCamera(false);
//       } catch (error) {
//         console.log("Error taking picture:", error);
//       }
//     } else {
//       console.log("Camera is not ready");
//     }
//   };

//   const switchCameraType = () => {
//     setCameraType(
//       cameraType === CameraType.back ? CameraType.front : CameraType.back
//     );
//   };

//   const takeAgain = () => {
//     setImage(null);
//     setRecognizedText("");
//     setShowCamera(true);
//   };

//   const MAX_IMAGE_SIZE = 1024 * 1024;
//   const checkAndResizeImage = async (imageUri) => {
//     try {
//       const fileInfo = await FileSystem.getInfoAsync(imageUri);
//       if (!fileInfo || !fileInfo.uri) {
//         throw new Error("Invalid file information");
//       }
//       const { size } = fileInfo;
//       if (size < MAX_IMAGE_SIZE) {
//         return imageUri;
//       }
//       const resizedImage = await ImageManipulator.manipulateAsync(
//         imageUri,
//         [{ resize: { width: 800 } }],
//         { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
//       );
//       return resizedImage.uri;
//     } catch (error) {
//       console.log("Error checking and resizing image:", error);
//       throw new Error("Error checking and resizing image: " + error.message);
//     }
//   };

//   const uploadImageToFirebase = async (imageUri) => {
//     try {
//       const fileInfo = await FileSystem.getInfoAsync(imageUri);
//       if (!fileInfo || !fileInfo.uri) {
//         throw new Error("Invalid file information");
//       }
//       const uri = fileInfo.uri;

//       const blob = await new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.onload = function () {
//           resolve(xhr.response);
//         };
//         xhr.onerror = (e) => {
//           reject(new TypeError("Network request failed"));
//         };
//         xhr.responseType = "blob";
//         xhr.open("GET", uri, true);
//         xhr.send(null);
//       });

//       const filename = uri.substring(uri.lastIndexOf("/") + 1);
//       console.log("Filename: ", filename);
//       const ref = firebase.storage().ref().child(`images/${filename}`);

//       const snapshot = await ref.put(blob);

//       blob.close();
//       console.log("Image uploaded to Firebase!");

//       const imageURL = await ref.getDownloadURL();
//       console.log("Image URL: ", imageURL);
//       return imageURL;
//     } catch (error) {
//       console.log("Error uploading image to Firebase Storage:", error);
//       throw new Error(
//         "Error uploading image to Firebase Storage: " + error.message
//       );
//     }
//   };

//   const processImage = async (uri) => {
//     try {
//       const resizedImageUri = await checkAndResizeImage(uri);
//       const uploadedImageUrl = await uploadImageToFirebase(resizedImageUri);
//       const result = await performOCR(uploadedImageUrl);

//       console.log("result: ", result);
//       const parsedText = result.ParsedResults[0]?.ParsedText;
//       const ErrorMessage = result.ParsedResults[0]?.ErrorMessage;
//       if (parsedText && parsedText.length > 0) {
//         setRecognizedText(parsedText);
//         console.log("parsedText: ", parsedText);
//       } else {
//         setRecognizedText("No text found.");
//       }

//       if (ErrorMessage && ErrorMessage.length > 0) {
//         setRecognizedText(ErrorMessage[0]);
//       }
//     } catch (error) {
//       console.log("Error recognizing text:", error);
//       setRecognizedText("Error recognizing text.");
//     }
//   };

//   const copyToClipboard = useCallback(async () => {
//     await Clipboard.setStringAsync(recognizedText);
//   }, [recognizedText]);

//   if (hasCameraPermission === null) {
//     return <View />;
//   }
//   if (hasCameraPermission === false) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
//         <Button onPress={requestCameraPermission} title="Grant Permission" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {showCamera && isFocused && hasCameraPermission && (
//         <Camera
//           style={styles.camera}
//           type={cameraType}
//           ref={cameraRef}
//           autoFocus={Camera.Constants.AutoFocus.on}
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

//       {image && (
//         <View style={styles.imagePreviewContainer}>
//           <Image source={{ uri: image }} style={styles.imagePreview} />

//           <TouchableOpacity style={styles.takeAgainButton} onPress={takeAgain}>
//             <Text style={styles.takeAgainText}>Take Again</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <View style={styles.resultContainer}>
//         <Text style={styles.recognizedText}>{recognizedText}</Text>

//         <TouchableOpacity
//           style={styles.iconContainer}
//           disabled={recognizedText === ""}
//           onPress={copyToClipboard}
//         >
//           <MaterialIcons
//             name="content-copy"
//             size={24}
//             color={
//               recognizedText !== ""
//                 ? colors.textColor
//                 : colors.textColorDisabled
//             }
//           />
//         </TouchableOpacity>
//       </View>

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
//     backgroundColor: "transparent",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "flex-end",
//     marginBottom: 20,
//   },
//   button: {
//     margin: 10,
//   },
//   imagePreviewContainer: {
//     flex: 1,
//   },
//   imagePreview: {
//     flex: 1
//     },
//   takeAgainButton: {
//     position: "absolute",
//     bottom: 20,
//     alignSelf: "center",
//     backgroundColor: "lightblue",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   takeAgainText: {
//     color: "blue",
//     fontWeight: "bold",
//   },
//   iconContainer: {
//     paddingHorizontal: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   recognizedText: {
//     alignSelf: "center",
//     marginVertical: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   switchCameraButton: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     borderRadius: 30,
//     padding: 10,
//   },
//   recognizedText: {
//     fontFamily: "regular",
//     letterSpacing: 0.3,
//     color: colors.primary,
//     flex: 1,
//     marginHorizontal: 20,
//   },
//   resultContainer: {
//     borderBottomColor: colors.lightGrey,
//     borderBottomWidth: 1,
//     flexDirection: "row",
//     height: 90,
//     paddingVertical: 15,
//   },
// });