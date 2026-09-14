import { View, Text, StyleSheet } from "react-native";

export default function Amenities() {
  return (
    <View style={styles.container}>
      <Text>Page des équipements</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
});