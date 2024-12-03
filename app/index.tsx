import { View, Button, FlatList, Text, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { UploadModal } from "@/components/UploadModal";
import { useSQLiteContext } from "expo-sqlite";
import PostItem from "@/components/PostItem";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { usePostStore } from "@/stores";
export default function MainScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const [allVideos, setAllVideos] = useState<any>([]);
  const db = useSQLiteContext();
  const { posts, loading, error, fetchPosts } = usePostStore();
  useEffect(() => {
    fetchPosts(db);
  }, [fetchPosts]);
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);

      // time needed for picker to close for modal to open
      setInterval(() => {
        setModalOpen(true);
      }, 1000);
    }
  };

  // const getData = async () => {
  //   const result = await db.getAllAsync<any>("SELECT * FROM post");
  //   // console.log(result);
  //   setAllVideos(result);
  // };
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
        <View className="flex-initial w-32">
          <Button title="upload" onPress={pickImage} />
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

      <UploadModal
        isOpen={modalOpen}
        videoUri={videoUri}
        setModalOpen={setModalOpen}
      />
    </View>
  );
}
