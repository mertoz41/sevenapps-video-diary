import { View, Text, TextInput } from "react-native";

const MetaDataForm = ({
  setName,
  setDescription,
  name,
  description,
}: {
  setName: any;
  setDescription: any;
  name: string;
  description: string;
}) => {
  return (
    <View className="w-full">
      <View className="mb-4">
        <Text className="text-xl font-medium mb-2">Name</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded-lg text-lg"
          placeholder={"enter name"}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className="mb-6">
        <Text className="text-xl font-medium mb-2">Description</Text>
        <TextInput
          className="border border-gray-300 p-3 rounded-lg text-lg"
          placeholder={"enter description"}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>
    </View>
  );
};

export default MetaDataForm;
