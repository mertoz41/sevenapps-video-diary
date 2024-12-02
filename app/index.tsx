import { View, StyleSheet, Button } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { UploadModal } from "@/components/UploadModal";
export default function MainScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);

      // time needed for picker to close for modal to open
      setInterval(() => {
        setModalOpen(true);
      }, 1000);
    }
  };

  return (
    <View className="flex-1 justify-center items-center h-full w-full bg-white">
      <View className="bg-red-500">
        <Button title="Pick an image from camera roll" onPress={pickImage} />
      </View>
      <UploadModal
        isOpen={modalOpen}
        videoUri={videoUri}
        setVideoUri={setVideoUri}
        setModalOpen={setModalOpen}
      />
    </View>
  );
}
