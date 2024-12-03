import {
  Modal,
  ModalProps,
  View,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useState } from "react";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { usePostStore } from "@/stores";
type PROPS = ModalProps & {
  isOpen: boolean;
  setModalOpen: any;
};

const trimVideo = async (videoUri: string) => {
  const newVidUri = videoUri.replace("file://", "");
  const randomString = Math.random().toString(36).substring(2, 8);
  const outputUri = `${videoUri.substring(
    0,
    videoUri.lastIndexOf("/")
  )}/${randomString}.mp4`;

  FFmpegKit.execute(`-y -ss 0 -i ${newVidUri} -t 5 -c copy ${outputUri}`).then(
    async (session) => {
      return outputUri;
    }
  );
  return outputUri;
};
const UploadModal = ({ isOpen, setModalOpen }: PROPS) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [videoUri, setVideoUri] = useState("");
  const db = useSQLiteContext();
  const { loading, error, addPost } = usePostStore();

  const uploadVideo = async (postData: any) => {
    const result = await db.runAsync(
      "INSERT INTO post (video_uri, name, description) VALUES (?, ?,?)",
      postData.video_uri,
      postData.name,
      postData.description
    );
    return result.lastInsertRowId;
  };

  const pickImage = async () => {
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
      let postData = {
        video_uri: trimmedVideo,
        name: name,
        description: description,
      };
      const result = await uploadVideo(postData);
      addPost({ ...postData, id: result });
      clearState();
      setModalOpen(false);
    },
  });

  const clearState = () => {
    setVideoUri("");
    setName("");
    setDescription("");
  };

  const handleProcessVideo = () => {
    mutation.mutate(videoUri);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalOpen(false)}
    >
      {/* Modal Overlay */}
      <View className="flex-1 justify-center items-center bg-black/50">
        {/* Modal Content */}
        <View className="bg-white w-11/12 h-3/4 rounded-lg p-4">
          <Button title="Select video" onPress={() => pickImage()} />

          {videoUri ? (
            <Pressable
              onPress={() => (isPlaying ? player.pause() : player.play())}
            >
              <VideoView
                style={{ height: 200, width: 120 }}
                player={player}
                nativeControls={false}
                allowsPictureInPicture
              />
            </Pressable>
          ) : null}
          <TextInput
            placeholder="Name"
            className="text-2xl placeholder-red-500 placeholder-opacity-100 italic text-black font-bold mb-4 bg-red-400"
            onChangeText={setName}
            value={name}
          />
          <TextInput
            placeholder="Description"
            onChangeText={setDescription}
            value={description}
            className="text-lg font-bold mb-4"
          />
          {videoUri ? (
            <Button title="submit" onPress={handleProcessVideo} />
          ) : null}
          <Button title="cancel" onPress={() => setModalOpen(false)} />
        </View>
      </View>
    </Modal>
  );
};

export default UploadModal;
