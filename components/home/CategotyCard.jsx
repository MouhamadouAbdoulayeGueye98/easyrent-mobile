
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function CategoryCard({
  item,
  active,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.card,
        active && styles.activeCard,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          active && styles.activeIconContainer,
        ]}
      >
        <Ionicons
          name={item.icon}
          size={23}
          color={active ? "#FFFFFF" : COLORS.primary}
        />
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.text,
          active && styles.activeText,
        ]}
      >
        {item.name}
      </Text>

      {active && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 96,
    height: 108,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EAEFF5",
    paddingHorizontal: 8,

    shadowColor: "#64748B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  activeCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },

  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  activeIconContainer: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  text: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  activeText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  activeIndicator: {
    position: "absolute",
    bottom: 7,
    width: 18,
    height: 3,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
});
