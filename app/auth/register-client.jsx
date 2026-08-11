import { useState } from "react";

import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { registerClient } from "../../services/auth";

export default function RegisterClient() {

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (
      !firstName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit contenir au moins 6 caractères.",
      );
      return;
    }

    try {
      setLoading(true);

      await registerClient({
        firstName,
        email,
        password,
      });

      Alert.alert("Succès", "Compte créé avec succès.");

      router.replace("/(tabs)");
    } catch (error) {
      let message = "Une erreur est survenue.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "Cette adresse email est déjà utilisée.";
          break;

        case "auth/invalid-email":
          message = "Adresse email invalide.";
          break;

        case "auth/weak-password":
          message = "Le mot de passe est trop faible.";
          break;

        default:
          message = error.message;
      }

      Alert.alert("Erreur", message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#0a0a0b" />
      </TouchableOpacity>

      <Text style={styles.title}>Inscription Client</Text>

      <Text style={styles.subtitle}>
        Créez votre compte pour trouver votre futur logement.
      </Text>


      <TextInput
        placeholder="Prénom"
        placeholderTextColor="#9CA3AF"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />


      <TextInput
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TextInput
        placeholder="Confirmer le mot de passe"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Créer mon compte</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text style={styles.loginText}>
          Vous avez déjà un compte ?{" "}
          <Text style={styles.loginLink}>Se connecter</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 25,
    paddingTop: 60,
    paddingBottom: 40,
  },

  backButton: {
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 30,
    color: "#6B7280",
    fontSize: 16,
    lineHeight: 24,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },

  loginText: {
    marginTop: 25,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
  },

  loginLink: {
    color: "#2563EB",
    fontWeight: "700",
  },
});