import { View, TouchableOpacity, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
const Header = ({
  navBack,
  buttonTitle,
  buttonAction,
}: {
  navBack: () => void;
  buttonTitle: string;
  buttonAction: () => void;
}) => {
  return (
    <View>
      <View className="h-10"></View>
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={() => navBack()}>
          <Ionicons name="arrow-back" size={44} color="black" />
        </Pressable>
        {buttonTitle == "update" ? null : (
          <TouchableOpacity
            onPress={() => buttonAction()}
            className="px-4 py-2 border-2 border-black rounded-full self-center"
          >
            <Text className="text-black font-medium">{buttonTitle}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
