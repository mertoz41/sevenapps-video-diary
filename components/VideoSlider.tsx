import { View, Pressable, TouchableOpacity, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useRef, useState } from "react";
import { Video } from "expo-av";

const VideoSlider = ({
  videoUri,
  duration,
  saveStartTime,
}: {
  videoUri: string;
  duration: number;
  saveStartTime: any;
}) => {
  const videoRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loopEnd, setLoopEnd] = useState(5000);
  const [loopStart, setLoopStart] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderValue = (value: any) => {
    if (value + 5000 < duration) {
      videoRef.current.getStatusAsync().then((status: any) => {
        videoRef.current.setPositionAsync(value);
        setLoopStart(value);
        setLoopEnd(value + 5000);
      });
    }
  };
  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded && status.positionMillis >= loopEnd) {
      videoRef.current.setPositionAsync(loopStart);
    }
  };
  return (
    <View>
      <Pressable onPress={() => togglePlayPause()}>
        <Video
          ref={videoRef}
          source={{
            uri: videoUri,
          }}
          isLooping
          shouldPlay={isPlaying}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          style={{ height: 500, width: 270 }}
        />
      </Pressable>

      <Slider
        style={{ width: 270, height: 40 }}
        minimumValue={0}
        value={sliderValue}
        onValueChange={handleSliderValue}
        upperLimit={duration - 5000}
        maximumValue={duration}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#000000"
      />
      <TouchableOpacity
        className="px-4 py-2 bg-blue-500 rounded-full self-center my-12"
        onPress={() => saveStartTime(loopStart)}
      >
        <Text className="text-white text-3xl">advance</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoSlider;
