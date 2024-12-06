import { View, TouchableOpacity, Text } from "react-native";
import { Post } from "@/types";
import VideoPlayer from "./VideoPlayer";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

const PostItem = ({
  post,
  viewingIndex,
  index,
  modalOpen,
}: {
  post: Post;
  viewingIndex: number;
  index: number;
  modalOpen: boolean;
}) => {
  const [shouldPlay, setShouldPlay] = useState(false);
  useEffect(() => {
    if (modalOpen) {
      setShouldPlay(false);
    } else if (viewingIndex == index) {
      setShouldPlay(true);
    } else {
      setShouldPlay(false);
    }
  }, [viewingIndex, modalOpen]);
  const router = useRouter();
  const navigateToDetails = () => {
    setShouldPlay(false);
    router.push({
      pathname: "/details/[id]",
      params: {
        ...post,
      },
    });
  };
  return (
    <View className=" rounded-xl shadow-lg w-[75%] items-center self-center p-4 bg-white mt-6 my-6 mb-6">
      <VideoPlayer videoUri={post.video_uri} shouldPlay={shouldPlay} />
      <TouchableOpacity
        className="px-4 py-2 border-2 border-black rounded-full self-center "
        onPress={() => navigateToDetails()}
      >
        <Text className="text-black font-medium">see details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostItem;
