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
import { z } from "zod";  
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRegisterMutation } from "../../services/api"; 
import { useAuth } from "../../context/AuthContext";       

// 3. Définition du schéma Zod pour l'inscription avec vérification des mots de passe
const registerSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  email: z.string().email("Veuillez entrer une adresse email valide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

export default function RegisterClient() {
  const { setUser } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 4. Récupération de la mutation d'inscription de RTK Query
  const [registerMutation, { isLoading }] = useRegisterMutation();

  async function handleRegister() {
    // 5. Validation des données avec Zod
    const validationResult = registerSchema.safeParse({
      firstName,
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      Alert.alert("Erreur de validation", errorMessage);
      return;
    }

    try {
      // 6. Appel de la mutation RTK Query
      const response = await registerMutation({ firstName, email, password }).unwrap();

      // Si l'inscription renvoie directement un token ou connecte l'utilisateur
      if (response && response.access_token) {
        await AsyncStorage.setItem('access_token', response.access_token);
      }

      // 7. Récupération du profil
      const profile = await getUserRole();
      if (profile) setUser(profile);

      Alert.alert("Succès", "Compte créé avec succès.");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      const serverMessage = error.data?.message;
      const message = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage || "Une erreur est survenue lors de l'inscription.";

      Alert.alert("Erreur", message);
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
        disabled={isLoading}
      >
        {isLoading ? (
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