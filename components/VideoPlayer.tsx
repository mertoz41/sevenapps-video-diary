import {  Pressable } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useEffect } from "react";

const VideoPlayer = ({
  videoUri,
  shouldPlay,
}: {
  videoUri: string;
  shouldPlay: boolean;
}) => {
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
  });
  useEffect(() => {
    if (shouldPlay) {
      player.play();
    } else {
      player.pause();
    }
  }, [shouldPlay]);
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
