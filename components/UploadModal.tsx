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
import { useQuery, useMutation } from "@tanstack/react-query";

type PROPS = ModalProps & {
  isOpen: boolean;
  videoUri: string;
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
export const UploadModal = ({ isOpen, videoUri, setModalOpen }: PROPS) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const db = useSQLiteContext();

  const uploadVideo = async (postData: any) => {
    await db.runAsync(
      "INSERT INTO post (video_uri, name, description) VALUES (?, ?,?)",
      postData.videoUri,
      postData.name,
      postData.description
    );
  };

  const mutation = useMutation({
    mutationFn: async (video: string) => {
      const trimmedVideo = await trimVideo(video);
      await uploadVideo({
        videoUri: trimmedVideo,
        name: name,
        description: description,
      });
      setModalOpen(false);
    },
  });

  const handleProcessVideo = () => {
    mutation.mutate(videoUri);
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      <View className="flex-1 justify-center ">
        <View className="items-center ">
          {/* {trimmedVideo ? (
            <Pressable
              onPress={() => (isPlaying ? player.pause() : player.play())}
            >
              <VideoView
                style={{ height: 400, width: 120 }}
                player={player}
                nativeControls={false}
                allowsPictureInPicture
              />
            </Pressable>
          ) : null} */}
          <TextInput placeholder="Name" onChangeText={setName} value={name} />
          <TextInput
            placeholder="Description"
            onChangeText={setDescription}
            value={description}
          />
          {/* <Button title="cancel" onPress={() => setModalOpen(false)} /> */}
          <Button title="submit" onPress={handleProcessVideo} />
        </View>
      </View>
    </Modal>
  );
};
