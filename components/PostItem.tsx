import { View, Pressable, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";

const PostItem = ({
  video,
  name,
  description,
}: {
  video: string;
  name: string;
  description: string;
}) => {
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  return (
    <View className="bg-red-500">
      <Pressable onPress={() => (isPlaying ? player.pause() : player.play())}>
        <VideoView
          style={{ height: 400, width: 120 }}
          player={player}
          nativeControls={false}
          allowsPictureInPicture
        />
      </Pressable>
      <Text>{name}</Text>
      <Text>{description}</Text>
    </View>
  );
};

export default PostItem;
