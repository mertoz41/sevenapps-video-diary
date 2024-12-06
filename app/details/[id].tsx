import { View, Text, TouchableOpacity } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { Post } from "@/types";
import VideoPlayer from "@/components/VideoPlayer";
import { usePostStore } from "@/stores";

const DetailsPage = () => {
  const [post, setPost] = useState<Post | unknown>();
  const [shouldPlay, setShouldPlay] = useState(true);
  const { id, video_uri }: { id: string; video_uri: string } =
    useLocalSearchParams();
  const db = useSQLiteContext();
  // Needed to get new post data upon navigating back from edit screen
  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      getPost(id);
      return () => {
        console.log("This route is now unfocused.");
      };
    }, [])
  );

  const getPost = async (id: string) => {
    const result = await db.getFirstAsync(
      "SELECT * FROM post WHERE id = ?",
      id
    );
    setPost(result);
  };

  const router = useRouter();

  const navigateToEdit = () => {
    setShouldPlay(false);
    router.push({
      pathname: "/edit/[id]",
      params: {
        id: id,
        video_uri: video_uri,
        name: post.name,
        description: post.description,
      },
    });
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <View className="h-12"></View>
      <View className="flex-row items-center justify-between mb-4">
        {post ? (
          <View>
            <Text className="text-4xl font-semibold">{post.name}</Text>
            <Text className="text-4xl font-semibold">{post.description}</Text>
          </View>
        ) : null}
        <TouchableOpacity
          onPress={() => navigateToEdit()}
          className="px-4 py-2 border-2 border-black rounded-full self-center"
        >
          <Text className="text-black font-medium">Edit</Text>
        </TouchableOpacity>
      </View>

      {post ? (
        <View className="items-center justify-center rounded-xl shadow-lg">
          <VideoPlayer videoUri={post.video_uri} shouldPlay={shouldPlay} />
        </View>
      ) : null}
    </View>
  );
};

export default DetailsPage;
