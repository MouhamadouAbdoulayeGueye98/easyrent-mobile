import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Header({
  title,
  showBack = false,
  rightIcon,
  onRightPress,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#111827"
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.right}>
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress}>
            <Ionicons
              name={rightIcon}
              size={24}
              color="#111827"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  left: {
    width: 30,
  },

  right: {
    width: 30,
    alignItems: "flex-end",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
});