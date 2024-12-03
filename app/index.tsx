import { View, Button, FlatList } from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { UploadModal } from "@/components/UploadModal";
import { useSQLiteContext } from "expo-sqlite";
import PostItem from "@/components/PostItem";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function MainScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [videoUri, setVideoUri] = useState("");
  const [allVideos, setAllVideos] = useState<any>([]);
  const db = useSQLiteContext();

  useEffect(() => {
    getData();
    // deleteAll()
  }, []);
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

  const getData = async () => {
    const result = await db.getAllAsync<any>("SELECT * FROM post");
    // console.log(result);
    setAllVideos(result);
  };
  const deleteAll = async () => {
    await db.execAsync("DELETE FROM post");
  };

  return (
    <View className="flex-1 h-full w-full justify-center bg-white">
      <View className="bg-red-500">
        <Button title="Pick an image from camera roll" onPress={pickImage} />
      </View>
      <SafeAreaProvider>
        <SafeAreaView className="bg-red-700 flex-1 w-full h-full justify-center items-center">
          {allVideos.length ? (
            <FlatList
              contentContainerStyle={{
                flex: 1,
                backgroundColor: "green",
                padding: 10,
              }}
              data={allVideos}
              renderItem={({ item }) => (
                <PostItem
                  video={item.video_uri}
                  name={item.name}
                  description={item.description}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          ) : null}
        </SafeAreaView>
      </SafeAreaProvider>
      {/* {allVideos.map((item: any) => (
        <PostItem
          key={item.id}
          video={item.video_uri}
          name={item.name}
          description={item.description}
        />
      ))} */}

      <UploadModal
        isOpen={modalOpen}
        videoUri={videoUri}
        setVideoUri={setVideoUri}
        setModalOpen={setModalOpen}
      />
    </View>
  );
}
