import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { Post } from "@/types";
import VideoPlayer from "@/components/VideoPlayer";
import Header from "@/components/Header";
const DetailsPage = () => {
  const [post, setPost] = useState<Post | undefined>();
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
    try {
      const result = await db.getFirstAsync(
        "SELECT * FROM post WHERE id = ?",
        id
      );
      setPost(result);
    } catch (error) {
      console.log(error);
    }
  };

  const router = useRouter();

  const navigateToEdit = () => {
    setShouldPlay(false);
    router.push({
      pathname: "/edit/[id]",
      params: {
        id: id,
        video_uri: video_uri,
        name: post?.name,
        description: post?.description,
      },
    });
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Header
        buttonTitle="edit"
        buttonAction={navigateToEdit}
        navBack={() => router.back()}
      />

      {post ? (
        <View>
          <Text className="text-4xl font-semibold">{post.name}</Text>
          <Text className="text-4xl font-semibold">{post.description}</Text>
        </View>
      ) : null}

      {post ? (
        <View className="items-center justify-center rounded-xl shadow-lg">
          <VideoPlayer videoUri={post.video_uri} shouldPlay={shouldPlay} />
        </View>
      ) : null}
    </View>
  );
};

export default DetailsPage;
