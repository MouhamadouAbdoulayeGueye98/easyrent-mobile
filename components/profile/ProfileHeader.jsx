import { View, Text, StyleSheet, Image } from "react-native";

export default function ProfileHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/avatar1.jpg")}
        style={styles.avatar}
      />

      <Text style={styles.name}>
        Abdoulaye Gueye
      </Text>

      <Text style={styles.email}>
        abdoulaye@email.com
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 35,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  email: {
    marginTop: 5,
    color: "#6B7280",
    fontSize: 16,
  },
});