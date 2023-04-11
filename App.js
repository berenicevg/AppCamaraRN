import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.getCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const data = await cameraRef.takePictureAsync(null);
      setCapturedImage(data.uri);
    }
  };

  const savePicture = async () => {
    await MediaLibrary.requestPermissionsAsync();
    await MediaLibrary.saveToLibraryAsync(capturedImage);
    alert("La foto ha sido guardada en la galería de tu dispositivo");
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Sin acceso a la camera</Text>;
  }
  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.preview}>
          <Text style={styles.camText}>¡Esta es la foto que tomaste!</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCapturedImage(null)}
          >
            <FontAwesome name="close" size={23} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={savePicture}>
            <FontAwesome name="save" size={23} color="white" />
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.capturedImage}
            />
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCameraRef(ref)}
            style={styles.camera}
            type={type}
            ratio={"4:3"}
          >
            <View style={styles.cameraButtonContainer}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={() =>
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  )
                }
              >
                <FontAwesome name="camera" size={23} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={takePicture}
              >
                <FontAwesome name="circle" size={23} color="white" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  cameraButton: {
    alignSelf: "flex-end",
    alignItems: "center",
  },
  preview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    height: "60%",
    marginBottom: 40,
    overflow: "hidden",
  },
  capturedImage: {
    flex: 1,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
  },
  saveButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  camText: {
    fontSize: 20,
    marginBottom: 20,
  },
});
