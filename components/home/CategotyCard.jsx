import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function CategoryCard({
  item,
  active,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        active && styles.activeCard,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={item.icon}
        size={24}
        color={
          active
            ? "#FFFFFF"
            : COLORS.primary
        }
      />

      <Text
        style={[
          styles.text,
          active && styles.activeText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    elevation: 4,
  },

  activeCard: {
    backgroundColor: COLORS.primary,
  },

  text: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  activeText: {
    color: "#FFFFFF",
  },
});