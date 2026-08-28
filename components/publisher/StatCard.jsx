import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function StatCard({
  title,
  value,
  icon,
  color,
  onPress,
}) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: color + "20",
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={28}
          color={color}
        />
      </View>

      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    marginTop: 15,
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  title: {
    marginTop: 5,
    color: "#6B7280",
  },
});