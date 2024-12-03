import { View, Pressable, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useEffect } from "react";
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
    // player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  return (
    <View className="w-1/3">
      <Pressable onPress={() => (isPlaying ? player.pause() : player.play())}>
        <VideoView
          style={{ height: 100, width: 300 }}
          player={player}
          nativeControls={false}
          contentFit="contain"
        />
      </Pressable>
      {/* <Text>{name}</Text>
      <Text>{description}</Text> */}
    </View>
  );
};

export default PostItem;
