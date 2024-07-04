import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState,useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from "../utils/colors";
export default function OcrScreen() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
    {"showCamera && isFocused && hasCameraPermission &&" (
      <CameraView
        style={styles.camera}
        type={facing}
        ref={cameraRef}
        // autoFocus={Camera.Constants.AutoFocus.on}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button title="Take Picture" onPress={"takePicture"} />
          </View>
          <View style={styles.button}>
            <Button title="Pick Image" onPress={"pickImage"} />
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