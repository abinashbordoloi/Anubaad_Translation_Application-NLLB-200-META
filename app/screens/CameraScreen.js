

//FREE OCR API LOGIC
import { firebase } from "../config/firebase";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import colors from "../utils/colors";
import React, { useState, useEffect, useCallback, useRef } from "react";

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
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { performOCR } from "../utils/ocr"; // Assuming this is correctly imported


export default function CameraScreen() {
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
      console.log(Camera.Constants);

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === "granted") {
        setHasCameraPermission(true);
        setShowCamera(true);
      }
    } catch (error) {
      console.log("Error requesting media library permissions:", error);
    }
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasCameraPermission(true);
      }
    } catch (error) {
      console.log("Error requesting camera permissions:", error);
    }
  };

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
        // console.log("photo.uri_________________: ", image)
        processImage(photo.uri);
        // console.log("photo.uri_________________: ", photo.uri);
        setShowCamera(false);
      } catch (error) {
        console.log("Error taking picture:", error);
      }
    } else {
      console.log("Camera is not ready");
    }
  };

  const switchCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
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
      const { size } = fileInfo.uri;
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

      // console.log("URI: ", uri);

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
      console.log("Filename: ", filename);
      const ref = firebase.storage().ref().child(`images/${filename}`);

      const snapshot = await ref.put(blob);

      blob.close();
      console.log("Image uploaded to Firebase!");

      const imageURL = await ref.getDownloadURL();
      console.log("Image URL: ", imageURL);
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

      console.log("result__________________________________________: ", result);
      const parsedText = result.ParsedResults[0]?.ParsedText;
      const ErrorMessage = result.ParsedResults[0]?.ErrorMessage;
      if (parsedText && parsedText.length > 0) {
        setRecognizedText(parsedText);
        console.log("parsedText: ", parsedText);
      } else {
        setRecognizedText("No text found.");
      }

      if (ErrorMessage && ErrorMessage.length > 0) {
        setRecognizedText(ErrorMessage[0]);
      }
    } catch (error) {
      console.log("Error recognizing text:", error);
      setRecognizedText("Error recognizing text.");
    }
  };
  const copyToClipboard = useCallback(async () => {
    await Clipboard.setStringAsync(recognizedText);
  }, [recognizedText]);

  useEffect(() => {
    requestPermissions();
  }, []);

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

      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />

          <TouchableOpacity style={styles.takeAgainButton} onPress={takeAgain}>
            <Text style={styles.takeAgainText}>Take Again</Text>
          </TouchableOpacity>

        </View>
      )}
      { (
        <View style={styles.resultContainer}>
          <Text style={styles.recognizedText}>{recognizedText}</Text>

          <TouchableOpacity
            style={styles.iconContainer}
            disabled={recognizedText === ""}
            onPress={copyToClipboard}
          >
            <MaterialIcons
              name="content-copy"
              size={24}
              color={
                recognizedText !== ""
                  ? colors.textColor
                  : colors.textColorDisabled
              }
            />
          </TouchableOpacity>
        </View>
      )}

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
    flex: 1
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
  recognizedText: {
    fontFamily: "regular",
    letterSpacing: 0.3,
    color: colors.primary,
    flex: 1,
    marginHorizontal: 20,
  },
  resultContainer: {
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 90,
    paddingVertical: 15,
  },
});

