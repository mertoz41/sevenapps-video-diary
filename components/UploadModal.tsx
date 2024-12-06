import {
  Modal,
  ModalProps,
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
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
import AntDesign from "@expo/vector-icons/AntDesign";
type PROPS = ModalProps & {
  isOpen: boolean;
  setModalOpen: any;
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
  const [loading, setLoading] = useState(false);
  const { addPost } = usePostStore();

  useEffect(() => {
    return setVideoUri("");
  }, []);
  const uploadVideo = async (postData: NewPost) => {
    try {
      const result = await db.runAsync(
        "INSERT INTO post (video_uri, name, description) VALUES (?, ?,?)",
        postData.video_uri,
        postData.name,
        postData.description
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.log(error);
    }
  };

  const pickVideo = async () => {
    setLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDuration(result.assets[0].duration as number);
      setVideoUri(result.assets[0].uri);
      setLoading(false);
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
    setDisplayInputs(false);
    setVideoUri("");
    setDuration(0);
    setVidStartTime("");
  };

  const handleProcessVideo = (data: any) => {
    mutation.mutate(data);
  };

  const saveStartTime = (times: any) => {
    const formattedTime = formatMilliseconds(times);
    setVidStartTime(formattedTime);
    setDisplayInputs(true);
  };

  const renderHeader = () => {
    return (
      <View className="flex-row justify-between ">
        <Text className="text-3xl font-bold self-end">New Post</Text>
        <TouchableOpacity
          className="p-1 border-2 border-black rounded-full self-center"
          onPress={() => clearState()}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => setModalOpen(false)}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 p-6 h-3/4 rounded-lg shadow-md">
            {renderHeader()}

            {displayInputs ? (
              <MetaDataForm
                submitForm={handleProcessVideo}
                buttonTitle={"upload"}
              />
            ) : null}
            {loading ? (
              <View className="flex-1 justify-center">
                <ActivityIndicator className="justify-center" />
              </View>
            ) : null}
            {videoUri && !displayInputs ? (
              <VideoSlider
                saveStartTime={saveStartTime}
                videoUri={videoUri}
                duration={duration}
              />
            ) : displayInputs ? null : (
              <View className="justify-center flex-1">
                <TouchableOpacity
                  className="px-4 py-2 border-2 border-black rounded-full align-middle self-center"
                  onPress={() => pickVideo()}
                >
                  <Text className="text-black text-3xl">select video</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default UploadModal;
