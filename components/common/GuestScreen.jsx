import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function GuestScreen({
  icon,
  title,
  description,
}) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={110}
        color="#2563EB"
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/auth/login")}
      >
        <Text style={styles.loginText}>
          Se connecter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/auth/register")}
      >
        <Text style={styles.registerText}>
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  description: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 24,
    fontSize: 16,
  },

  loginButton: {
    width: "100%",
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 15,
  },

  loginText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },

  registerButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#2563EB",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  registerText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 16,
  },
});