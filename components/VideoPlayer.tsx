import { View, Pressable } from "react-native";
import { useVideoPlayer, VideoView, VideoThumbnail } from "expo-video";
import { useEvent } from "expo";

const VideoPlayer = ({ videoUri }: { videoUri: string }) => {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    // player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <Pressable onPress={() => (isPlaying ? player.pause() : player.play())}>
      <VideoView
        style={{ height: 500, width: 270 }}
        player={player}
        nativeControls={false}
        allowsPictureInPicture
      />
    </Pressable>
  );
};

export default VideoPlayer;
