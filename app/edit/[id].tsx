import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import MetaDataForm from "@/components/MetaDataForm";
const EditPage = () => {
  const {
    id,
    video_uri,
    name,
    description,
  }: { id: string; video_uri: string; name: string; description: string } =
    useLocalSearchParams();
  const db = useSQLiteContext();

  const [newName, setNewName] = useState(name);
  const [newDescription, setNewDescription] = useState(description);

  const router = useRouter();

  const handleSave = async (data: any) => {
    const result = await db.runAsync(
      "UPDATE post SET name = ?, description = ? WHERE id = ?",
      data.name,
      data.description,
      id
    );
    router.back();
  };

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-3xl font-semibold mb-6">Edit Metadata</Text>
      <MetaDataForm submitForm={handleSave} />
      <TouchableOpacity
        className="px-4 py-2 border-2 border-black rounded-full self-center"
        onPress={handleSave}
      >
        <Text className="text-black text-lg font-medium">Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditPage;
