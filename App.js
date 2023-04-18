import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Camera } from "expo-camera";

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync();
      setCapturedImage(data.uri);
    }
  };

  const switchCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Sin acceso a la camara </Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camara} type={type} ref={cameraRef}>
        <View style={styles.botonContenedor}>
          <TouchableOpacity style={styles.boton} onPress={switchCamera}>
            <Text style={styles.texto}> Voltear camara </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boton} onPress={takePicture}>
            <Text style={styles.texto}> Tomar Foto </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedImage && (
        <View style={styles.vistaPreviaContenedor}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.vistaPreviaImagen}
          />
          <Button
            title="Volver a tomar"
            onPress={() => setCapturedImage(null)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  camara: {
    flex: 1,
    width: "100%",
  },
  botonContenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 5,
    alignItems: "flex-end",
    flex: 1,
  },
  boton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 70,
    justifyContent: "center",
    width: 100,
  },
  texto: {
    color: "#000",
    fontSize: 16,
  },
  vistaPreviaContenedor: {
    backgroundColor: "white",
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  vistaPreviaImagen: {
    width: "30%",
    height: "80%",
    resizeMode: "contain",
  },
});
