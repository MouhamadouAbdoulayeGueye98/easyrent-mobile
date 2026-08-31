import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { login, getUserRole } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { setUser } = useAuth();

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

      // 1. Connexion via le backend NestJS
      const response = await login(email, password);

      // CORRECTION CRUCIALE : Stocker le nouveau token pour écraser l'ancien
      if (response && response.access_token) {
        await AsyncStorage.setItem('access_token', response.access_token);
      }

      // 2. Récupération du profil utilisateur complet
      const profile = await getUserRole();

      if (profile) {
        setUser(profile);
      }

      // 3. Redirection selon le rôle
      const userRole = profile?.role || response?.user?.role;

      if (userRole === "ANNONCEUR") {
        router.replace("/publisher");
      } else if (userRole === "ADMIN") {
        // Pour l'instant, on peut garder une redirection temporaire
        router.replace("/(tabs)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      const serverMessage = error.response?.data?.message;
      const message = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage || "Email ou mot de passe incorrect.";

      Alert.alert("Connexion", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Bouton flèche retour */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>

      <Text style={styles.logo}>🏠</Text>

      <Text style={styles.title}>Bon retour</Text>

      <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

      <TextInput
        placeholder="Adresse email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

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

      <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
        <Text style={styles.forgot}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

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

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.register}>
          Pas encore de compte ?{" "}
          <Text style={styles.link}>Créer un compte</Text>
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
    top: 60,
    left: 25,
    zIndex: 10,
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
    marginTop: 35,
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