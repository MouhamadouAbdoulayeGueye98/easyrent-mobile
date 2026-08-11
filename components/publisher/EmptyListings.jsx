import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EmptyListings({ onPress }) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="home-outline"
        size={90}
        color="#2563EB"
      />

      <Text style={styles.title}>
        Aucune annonce
      </Text>

      <Text style={styles.subtitle}>
        Vous n'avez pas encore publié de logement.
        Commencez dès maintenant.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
      >
        <Ionicons
          name="add-circle-outline"
          size={22}
          color="#FFFFFF"
        />

        <Text style={styles.buttonText}>
          Ajouter un logement
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
    padding: 30,
  },

  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 10,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 24,
    fontSize: 16,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 35,
    backgroundColor: "#2563EB",
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 10,
    fontSize: 16,
  },
});