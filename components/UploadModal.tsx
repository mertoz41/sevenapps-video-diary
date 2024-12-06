import {
  Modal,
  ModalProps,
  View,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useState } from "react";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { usePostStore } from "@/stores";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useEffect } from "react";
import MetaDataForm from "./MetaDataForm";
import { PostSchema } from "@/types";
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

const trimVideo = async (videoUri: string) => {
  const newVidUri = videoUri.replace("file://", "");
  const randomString = Math.random().toString(36).substring(2, 8);
  const outputUri = `${videoUri.substring(
    0,
    videoUri.lastIndexOf("/")
  )}/${randomString}.mp4`;

  await FFmpegKit.execute(
    `-y -ss 0 -i ${newVidUri} -t 5 -c copy ${outputUri}`
  ).then(async (session) => {
    return outputUri;
  });
  return outputUri;
};

const UploadModal = ({ isOpen, setModalOpen }: PROPS) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoUri, setVideoUri] = useState("");
  const db = useSQLiteContext();
  const [displayInputs, setDisplayInputs] = useState(false);
  const { addPost } = usePostStore();
  useEffect(() => {
    return setVideoUri("");
  }, []);
  const uploadVideo = async (postData: NewPost) => {
    console.log("we here ")
    const validation = PostSchema.safeParse(postData);
    if (!validation.success) {
      console.log(validation);
    } else {
      // const result = await db.runAsync(
      //   "INSERT INTO post (video_uri, thumbnail, name, description) VALUES (?, ?, ?,?)",
      //   postData.video_uri,
      //   postData.thumbnail,
      //   postData.name,
      //   postData.description
      // );
      // return result.lastInsertRowId;
    }
  };

  const generateThumbnail = async (video: string) => {
    const { uri } = await VideoThumbnails.getThumbnailAsync(video, {
      time: 15000,
    });
    return uri;
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    // player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const mutation = useMutation({
    mutationFn: async (video: string) => {
      const trimmedVideo = await trimVideo(video);
      const thumbnail = await generateThumbnail(trimmedVideo);
      let postData = {
        video_uri: trimmedVideo,
        thumbnail: thumbnail,
        name: name,
        description: description,
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
    setName("");
    setDescription("");
  };

  const handleProcessVideo = () => {
    mutation.mutate(videoUri);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => setModalOpen(false)} // Handles the back button on Android
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
                <MetaDataForm
                  setName={setName}
                  setDescription={setDescription}
                  name={name}
                  description={description}
                />
              ) : null}

              <View className="flex-1 justify-start items-center mt6">
                {videoUri ? (
                  <Pressable
                    onPress={() => (isPlaying ? player.pause() : player.play())}
                  >
                    <VideoView
                      style={{ height: 500, width: 270 }}
                      player={player}
                      nativeControls={false}
                      allowsPictureInPicture
                    />
                  </Pressable>
                ) : (
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded-full self-center my-12"
                    onPress={() => pickVideo()}
                  >
                    <Text className="text-white text-3xl">choose video</Text>
                  </TouchableOpacity>
                )}

                {!videoUri ? null : displayInputs ? (
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded-full self-center my-12"
                    onPress={() => handleProcessVideo()}
                  >
                    <Text className="text-white text-3xl">upload</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded-full self-center my-12"
                    onPress={() => setDisplayInputs(true)}
                  >
                    <Text className="text-white text-3xl">advance</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
