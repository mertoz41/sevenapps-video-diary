import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import MetaDataForm from "@/components/MetaDataForm";
import Header from "@/components/Header";
const EditPage = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      const result = await db.runAsync(
        "UPDATE post SET name = ?, description = ? WHERE id = ?",
        data.name,
        data.description,
        id
      );
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 p-6 bg-white">
      <Header
        buttonAction={() => {}}
        navBack={() => router.back()}
        buttonTitle="update"
      />
      <MetaDataForm submitForm={handleSave} buttonTitle={"update"} />
    </View>
  );
};

export default EditPage;
