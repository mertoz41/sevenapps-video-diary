import { View, TouchableOpacity, Text } from "react-native";
import { Post } from "@/types";
import VideoPlayer from "./VideoPlayer";
import { useRouter } from "expo-router";

const PostItem = ({ post }: { post: Post }) => {
  const router = useRouter();
  const navigateToDetails = () => {
    router.push({
      pathname: "/details/[id]",
      params: {
        ...post,
      },
    });
  };
  return (
    <View className=" rounded-xl shadow-lg w-[75%] items-center self-center  h-[90%] my-2">
      <VideoPlayer videoUri={post.video_uri} />
      <TouchableOpacity
        className="px-4 py-2 border-2 border-black rounded-full self-center "
        onPress={() => navigateToDetails()}
      >
        <Text className="text-black font-medium">details</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostItem;
