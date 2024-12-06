import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller, FieldError } from "react-hook-form";
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
const MetaDataForm = ({
  submitForm,
  buttonTitle,
}: {
  submitForm: (data: any) => void;
  buttonTitle: string;
}) => {
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
    <View>
      <Text className="text-3xl mb-4 font-semibold text-center mt-10">
        {buttonTitle == "upload" ? "enter " : "edit "}metadata
      </Text>

      <View className="w-full mb-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              className={"border-2 p-4 rounded-2xl text-2xl"}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
              placeholder="enter name"
            />
          )}
        />
        <View className="h-4">
          {errors.name && (
            <Text className="text-red-500 font-bold">
              {(errors.name as FieldError).message}
            </Text>
          )}
        </View>
      </View>

      <View className="w-full mb-6">
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border-2 p-4 rounded-2xl text-2xl"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholderTextColor={"rgba(0, 0, 0, 0.3)"}
              placeholder="enter description"
            />
          )}
        />
        <View className="h-10">
          {errors.description && (
            <Text className="text-red-500 font-bold">
              {(errors.description as FieldError).message}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        className="px-4 py-2 border-2 border-black rounded-full self-center"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-black text-lg font-medium">{buttonTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MetaDataForm;
