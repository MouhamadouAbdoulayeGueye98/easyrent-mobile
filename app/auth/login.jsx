import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getUserRole, login, resetPassword } from "../../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert(
        "Champs obligatoires",
        "Veuillez remplir tous les champs."
      );
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      const profile = await getUserRole(user.uid);

      if (profile?.role === "publisher") {
        router.replace("/publisher");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      let message = "Une erreur est survenue lors de la connexion.";

      if (error.code === "auth/user-not-found") {
        message = "Aucun compte trouvé.";
      } else if (error.code === "auth/wrong-password") {
        message = "Mot de passe incorrect.";
      } else if (error.code === "auth/invalid-email") {
        message = "Adresse email invalide.";
      } else if (error.code === "auth/invalid-credential") {
        message = "Email ou mot de passe incorrect.";
      }

      Alert.alert("Connexion", message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert(
        "Adresse email requise",
        "Veuillez d'abord saisir votre adresse email dans le champ ci-dessus."
      );
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);

      Alert.alert(
        "Demande envoyée",
        `Si un compte est associé à l'adresse ${email}, vous recevrez un e-mail avec les instructions.`
      );
    } catch (error) {
      let message = "Impossible d'envoyer la demande pour le moment.";

      if (error.code === "auth/user-not-found") {
        message = "Aucun compte ne correspond à cet e-mail.";
      } else if (error.code === "auth/invalid-email") {
        message = "Adresse e-mail invalide.";
      }

      Alert.alert("Réinitialisation", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Le logo "Bravo" reste en haut */}
        <Text style={styles.logo}>👏</Text>

        <Text style={styles.title}>Bon retour</Text>

        <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

        {/* Champ Email */}
        <TextInput
          placeholder="Adresse email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {/* Champ Mot de passe */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
          />

          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        {/* Bouton Mot de passe oublié */}
        <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
          <Text style={styles.forgot}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        {/* Bouton Se connecter */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        {/* Lien Inscription */}
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={styles.register}>
            Pas encore de compte ?{" "}
            <Text style={styles.link}>Créer un compte</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    // backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 25,
  },
  logo: {
    fontSize: 60,
    textAlign: "center",
  },
  title: {
    marginTop: 15,
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 30,
    fontSize: 15,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },
  forgot: {
    alignSelf: "flex-end",
    marginTop: 12,
    color: "#2563EB",
    fontWeight: "600",
  },
  button: {
    marginTop: 25,
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
  register: {
    marginTop: 25,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
  },
  link: {
    color: "#2563EB",
    fontWeight: "700",
  },
});