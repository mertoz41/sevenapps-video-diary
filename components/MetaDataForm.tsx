import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
});
const MetaDataForm = ({ submitForm }: { submitForm: any }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    submitForm(data);
  };
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <View className="mb-4 w-full">
        <Text className="text-xl font-medium mb-2">Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              className="border border-gray-300 p-3 w-full rounded-lg text-lg"
              onChangeText={onChange}
              value={value}
              placeholder="enter name"
            />
          )}
        />
        {errors.name && (
          <Text className="text-red-500 text-lg font-bold">
            {errors.name.message}
          </Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-xl font-medium mb-2">Description</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 p-3 rounded-lg text-lg"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="enter description"
            />
          )}
        />
        {errors.description && (
          <Text className="text-red-500 text-lg font-bold">
            {errors.description.message}
          </Text>
        )}
      </View>
      <Button title="upload" onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default MetaDataForm;
