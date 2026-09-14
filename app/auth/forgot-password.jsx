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
import { router } from "expo-router";

import { forgotPassword } from "../../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendReset() {
    // Nettoyage des espaces autour de l'email
    const formattedEmail = email.trim();

    if (!formattedEmail) {
      Alert.alert(
        "Adresse email requise",
        "Veuillez saisir votre adresse email."
      );
      return;
    }

    try {
      setLoading(true);

      // Appels à la fonction d'authentification
      await forgotPassword(formattedEmail);

      setSent(true);

      Alert.alert(
        "Enregistré avec succès",
        `Un e-mail de réinitialisation de mot de passe a été envoyé à l'adresse ${formattedEmail}.`
      );
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);

      let message = "Impossible d'envoyer la demande pour le moment.";

      const errorCode = error?.code || error?.status || error?.type;

      switch (errorCode) {
        case "auth/user-not-found":
        case "user_not_found":
        case 404:
          message = "Aucun compte ne correspond à cet e-mail.";
          break;

        case "auth/invalid-email":
        case "user_invalid_email":
        case 400:
          message = "Adresse e-mail invalide.";
          break;

        default:
          message = error?.message || message;
      }

      Alert.alert("Réinitialisation", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.logo}>🔒</Text>

      <Text style={styles.title}>Mot de passe oublié</Text>

      <Text style={styles.subtitle}>
        Saisissez votre adresse email, nous vous enverrons un lien pour
        réinitialiser votre mot de passe.
      </Text>

      <TextInput
        placeholder="Adresse email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        editable={!loading}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Envoyer</Text>
        )}
      </TouchableOpacity>

      {sent && (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
          <Text style={styles.successText}>
            Demande enregistrée avec succès ! Vérifiez votre boîte mail.
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={() => router.replace("/auth/login")}>
        <Text style={styles.register}>
          Vous vous souvenez de votre mot de passe ?{" "}
          <Text style={styles.link}>Se connecter</Text>
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
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 40,
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
    fontSize: 18,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    gap: 8,
  },
  successText: {
    flex: 1,
    color: "#166534",
    fontSize: 14,
    fontWeight: "500",
  },
  register: {
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