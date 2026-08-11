import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Register() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      <Text style={styles.subtitle}>
        Choisissez le type de compte qui vous correspond.
      </Text>

      {/* Client */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push("/auth/register-client")}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="person" size={42} color="#2563EB" />
        </View>

        <Text style={styles.cardTitle}>Client</Text>

        <Text style={styles.cardDescription}>
          Je cherche un logement à louer ou à acheter.
        </Text>

        <View style={styles.button}>
          <Text style={styles.buttonText}>Continuer</Text>
        </View>
      </TouchableOpacity>

      {/* Annonceur */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => router.push("/auth/register-publisher")}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="business" size={42} color="#10B981" />
        </View>

        <Text style={styles.cardTitle}>Annonceur</Text>

        <Text style={styles.cardDescription}>
          Je souhaite publier et gérer mes logements.
        </Text>

        <View
          style={[
            styles.button,
            {
              backgroundColor: "#10B981",
            },
          ]}
        >
          <Text style={styles.buttonText}>Continuer</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 40,
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 25,
    marginBottom: 25,
    alignItems: "center",
    elevation: 4,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  cardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  cardDescription: {
    marginTop: 10,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 22,
    fontSize: 15,
  },

  button: {
    marginTop: 25,
    backgroundColor: "#2563EB",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});