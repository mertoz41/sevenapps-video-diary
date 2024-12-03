import {
  View,
  Button,
  FlatList,
  Modal,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import UploadModal from "@/components/UploadModal";
import { useSQLiteContext } from "expo-sqlite";
import PostItem from "@/components/PostItem";
import { usePostStore } from "@/stores";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const db = useSQLiteContext();
  const { loading, error, fetchPosts } = usePostStore();
  const posts = usePostStore((state) => state.posts);

  useEffect(() => {
    fetchPosts(db);
    // deleteAll();
  }, [fetchPosts]);

  const deleteAll = async () => {
    await db.execAsync("DELETE FROM post");
  };
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View className="flex-1 h-full w-full  bg-white">
      <View className="flex-row justify-between mt-16 border-b-2">
        <View>
          <Text className="flex-initial w-64 text-3xl self-end">
            Recently added
          </Text>
        </View>

        <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
          <Button title="Show Modal" onPress={() => setModalOpen(true)} />
        </SafeAreaView>
        <View className="flex-initial w-32">
          <UploadModal isOpen={modalOpen} setModalOpen={setModalOpen} />
        </View>
      </View>

      <View className="flex-1 flex-wrap bg-red-300 w-full">
        <FlatList
          contentContainerClassName=" flex-wrap bg-blue-400 w-full"
          data={posts}
          horizontal
          renderItem={({ item }) => (
            <PostItem
              video={item.video_uri}
              name={item.name}
              description={item.description}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}
