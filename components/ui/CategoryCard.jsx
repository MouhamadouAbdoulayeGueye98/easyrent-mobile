import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function CategoryCard({ item }) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.icon}>{item.icon}</Text>

      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginRight: 12,
    width: 90,
  },

  icon: {
    fontSize: 30,
  },

  name: {
    marginTop: 8,
    fontSize: 13,
  },
});
