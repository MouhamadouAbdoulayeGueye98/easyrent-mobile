import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { resetPassword } from "../../services/auth";

export default function ResetPassword() {
  const { token } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!token) {
      Alert.alert("Erreur", "Le lien de réinitialisation est invalide.");
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert("Champs requis", "Veuillez remplir tous les champs.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Mot de passe invalide",
        "Le mot de passe doit contenir au moins 6 caractères.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, password);

      Alert.alert(
        "Mot de passe modifié",
        "Votre mot de passe a été réinitialisé avec succès.",
        [
          {
            text: "Se connecter",
            onPress: () => router.replace("/auth/login"),
          },
        ],
      );
    } catch (error) {
      console.error("Erreur réinitialisation mot de passe :", error);

      const message =
        error?.response?.data?.message ||
        "Le lien de réinitialisation est invalide ou expiré.";

      Alert.alert("Réinitialisation", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.logo}>🔐</Text>

      <Text style={styles.title}>Nouveau mot de passe</Text>

      <Text style={styles.subtitle}>
        Choisissez un nouveau mot de passe pour sécuriser votre compte.
      </Text>

      <TextInput
        placeholder="Nouveau mot de passe"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        editable={!loading}
      />

      <TextInput
        placeholder="Confirmer le mot de passe"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        editable={!loading}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/auth/login")}>
        <Text style={styles.login}>
          Retour à la <Text style={styles.link}>connexion</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    padding: 25,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 8,
  },

  logo: {
    fontSize: 60,
    textAlign: "center",
  },

  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 35,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    paddingHorizontal: 10,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 17,
  },

  login: {
    marginTop: 30,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
  },

  link: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
