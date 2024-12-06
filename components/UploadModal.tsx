import {
  Modal,
  ModalProps,
  View,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { usePostStore } from "@/stores";
import { useEffect } from "react";
import MetaDataForm from "./MetaDataForm";
import VideoSlider from "./VideoSlider";
import { formatMilliseconds } from "@/utils";
type PROPS = ModalProps & {
  isOpen: boolean;
  setModalOpen: any;
  videoUri: string;
};

type NewPost = {
  video_uri: string;
  thumbnail: string;
  name: string;
  description: string;
};

const trimVideo = async (videoUri: string, vidStartTime: string) => {
  const newVidUri = videoUri.replace("file://", "");
  const randomString = Math.random().toString(36).substring(2, 8);
  const outputUri = `${videoUri.substring(
    0,
    videoUri.lastIndexOf("/")
  )}/${randomString}.mp4`;

  await FFmpegKit.execute(
    `-y -ss ${vidStartTime} -i ${newVidUri} -t 5 -c copy ${outputUri}`
  ).then(async (session) => {
    return outputUri;
  });
  return outputUri;
};

const UploadModal = ({ isOpen, setModalOpen }: PROPS) => {
  const [videoUri, setVideoUri] = useState("");
  const db = useSQLiteContext();
  const [displayInputs, setDisplayInputs] = useState(false);
  const [duration, setDuration] = useState(0);
  const [vidStartTime, setVidStartTime] = useState("");
  const { addPost } = usePostStore();
  useEffect(() => {
    return setVideoUri("");
  }, []);
  const uploadVideo = async (postData: NewPost) => {
    const result = await db.runAsync(
      "INSERT INTO post (video_uri, name, description) VALUES (?, ?,?)",
      postData.video_uri,
      postData.name,
      postData.description
    );
    return result.lastInsertRowId;
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setDuration(result.assets[0].duration);
      setVideoUri(result.assets[0].uri);
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const trimmedVideo = await trimVideo(videoUri, vidStartTime);
      let postData = {
        video_uri: trimmedVideo,
        ...data,
      };
      const result = await uploadVideo(postData);
      addPost({ ...postData, id: result });
      clearState();
    },
  });

  const clearState = () => {
    setModalOpen(false);
    setVideoUri("");
    setDisplayInputs(false);
  };

  const handleProcessVideo = (data: any) => {
    mutation.mutate(data);
  };

  const saveStartTime = (times: any) => {
    const formattedTime = formatMilliseconds(times);
    setVidStartTime(formattedTime);
    setDisplayInputs(true);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => setModalOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View className="flex-row justify-between items-center bg-red-500">
              <Text className="text-3xl font-bold">new post</Text>
              <TouchableOpacity onPress={() => clearState()}>
                <Text className="text-3xl font-bold self-end text-gray-500">
                  X
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {displayInputs ? (
                <MetaDataForm submitForm={handleProcessVideo} />
              ) : null}

              <View className="flex-1 justify-start items-center mt6">
                {videoUri && !displayInputs ? (
                  <VideoSlider
                    saveStartTime={saveStartTime}
                    videoUri={videoUri}
                    duration={duration}
                  />
                ) : displayInputs ? null : (
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded-full self-center my-12"
                    onPress={() => pickVideo()}
                  >
                    <Text className="text-white text-3xl">choose video</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    width: "80%",
    height: 650,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default UploadModal;
