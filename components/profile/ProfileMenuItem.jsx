
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function ProfileMenuItem({
  icon,
  title,
  color = "#2563EB",
  backgroundColor = "#EFF6FF",
  danger = false,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor },
          ]}
        >
          <Ionicons
            name={icon}
            size={21}
            color={color}
          />
        </View>

        <Text
          style={[
            styles.title,
            danger && styles.dangerTitle,
          ]}
        >
          {title}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color={danger ? "#FCA5A5" : "#A1AAB8"}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 68,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 17,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#EEF1F6",

    shadowColor: "#64748B",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 1,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginLeft: 14,
    fontSize: 14,
    fontWeight: "600",
    color: "#263449",
  },

  dangerTitle: {
    color: "#EF4444",
  },
});
