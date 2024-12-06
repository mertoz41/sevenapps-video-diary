import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import UploadModal from "@/components/UploadModal";
import { useSQLiteContext } from "expo-sqlite";
import PostItem from "@/components/PostItem";
import { usePostStore } from "@/stores";

export default function MainScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingIndex, setViewingIndex] = useState(0);
  const db = useSQLiteContext();
  const { error, fetchPosts } = usePostStore();
  const posts = usePostStore((state) => state.posts);
  const loading = usePostStore((state) => state.loading);

  const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 70,
  };
  useEffect(() => {
    fetchPosts(db);
    // deleteAll();
  }, [fetchPosts]);
  const deleteAll = async () => {
    await db.execAsync("DELETE FROM post");
  };

  const viewableItemChanged = ({ viewableItems }: { viewableItems: any }) => {
    if (viewableItems.length) {
      setViewingIndex(viewableItems[0].index);
    }
  };

  const renderHeader = () => (
    <View className="flex-row items-center h-24 justify-between px-4 py-3 bg-white shadow-md">
      <Text className="text-3xl font-boldtext-gray-500 self-end">
        Recently Added
      </Text>
      <TouchableOpacity
        className="px-4 py-2 border-2 border-black rounded-full self-end"
        onPress={() => setModalOpen(true)}
      >
        <Text className="text-black font-medium">add new</Text>
      </TouchableOpacity>
    </View>
  );
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View className="flex-1 h-full w-full justify-center  bg-white">
      {renderHeader()}
      <UploadModal isOpen={modalOpen} setModalOpen={setModalOpen} />
      <FlatList
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ marginTop: 5 }}
        onViewableItemsChanged={viewableItemChanged}
        data={posts}
        renderItem={({ item, index }) => (
          <PostItem
            key={item.id}
            post={item}
            modalOpen={modalOpen}
            index={index}
            viewingIndex={viewingIndex}
          />
        )}
      />
    </View>
  );
}
