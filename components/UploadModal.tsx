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

type PROPS = ModalProps & {
  isOpen: boolean;
  videoUri: string;
  setModalOpen: any;
  setVideoUri: any;
};
export const UploadModal = ({
  isOpen,
  videoUri,
  setModalOpen,
  setVideoUri,
}: PROPS) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trimmedVideo, setTrimmedVideo] = useState("");
  const player = useVideoPlayer(trimmedVideo, (player) => {
    player.loop = true;
    player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const handleTrim = () => {
    const newVidUri = videoUri.replace("file://", "");
    const outputUri = `${videoUri.substring(
      0,
      videoUri.lastIndexOf("/")
    )}/trimmed_video.mp4`;

    FFmpegKit.execute(
      `-y -ss 0 -i ${newVidUri} -t 5 -c copy ${outputUri}`
    ).then(async (session) => {
      const output = await session.getOutput();
      setTrimmedVideo(outputUri);
    });
  };

  return (
    <Modal visible={isOpen} animationType="slide">
      <View className="flex-1 justify-center ">
        <View className="items-center ">
          {trimmedVideo ? (
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
          ) : null}
          <TextInput placeholder="Name" onChangeText={setName} value={name} />
          <TextInput
            placeholder="Description"
            onChangeText={setDescription}
            value={description}
          />
          <Button title="cancel" onPress={() => setModalOpen(false)} />
          <Button title="submit" onPress={handleTrim} />
        </View>
      </View>
    </Modal>
  );
};
