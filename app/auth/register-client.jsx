import { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { registerClient, getUserRole } from "../../services/auth";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  background: "#F4F7FC",
  white: "#FFFFFF",
  text: "#172033",
  muted: "#758198",
  border: "#E2E8F0",
  inputBackground: "#FFFFFF",
};

export default function RegisterClient() {
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (
      !firstName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      showToast("Veuillez remplir tous les champs.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (password.length < 6) {
      showToast(
        "Le mot de passe doit contenir au moins 6 caractères.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      await registerClient({
        firstName: firstName.trim(),
        email: email.trim(),
        password,
      });

      const profile = await getUserRole();

      if (profile) {
        setUser(profile);
      }

      showToast("Compte créé avec succès.", "success");

      router.replace("/(tabs)");
    } catch (error) {
      let message = "Une erreur est survenue. Veuillez réessayer.";

      switch (error?.code) {
        case "auth/email-already-in-use":
          message = "Cette adresse email est déjà utilisée.";
          break;

        case "auth/invalid-email":
          message = "Adresse email invalide.";
          break;

        case "auth/weak-password":
          message = "Le mot de passe est trop faible.";
          break;

        default: {
          const apiMessage = error?.response?.data?.message;

          if (Array.isArray(apiMessage)) {
            message = apiMessage.join("\n");
          } else if (typeof apiMessage === "string") {
            message = apiMessage;
          } else if (error?.message) {
            message = error.message;
          }

          break;
        }
      }

      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Retour"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.white}
            />
          </TouchableOpacity>

          <View style={styles.brand}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/easyrent-icon-1024.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.brandName}>Easy Rent</Text>
            <Text style={styles.brandSubtitle}>
              Trouvez le logement qui vous ressemble
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.title}>Créer un compte</Text>

          <Text style={styles.subtitle}>
            Rejoignez Easy Rent et trouvez votre futur logement en toute
            simplicité.
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Prénom</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.muted}
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="Votre prénom"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Adresse email</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.muted}
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="exemple@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mot de passe</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.muted}
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="6 caractères minimum"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((previous) => !previous)}
                accessibilityLabel={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={21}
                  color={COLORS.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={COLORS.muted}
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="Retapez votre mot de passe"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                accessibilityLabel={
                  showConfirmPassword
                    ? "Masquer la confirmation"
                    : "Afficher la confirmation"
                }
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={21}
                  color={COLORS.muted}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.buttonText}>Créer mon compte</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={COLORS.white}
                />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Vous avez déjà un compte ?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              disabled={loading}
            >
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={COLORS.muted}
          />
          <Text style={styles.footerText}>
            Votre expérience logement commence ici.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === "android" ? 18 : 52,
    paddingHorizontal: 24,
    paddingBottom: 45,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    alignItems: "center",
    marginTop: 12,
  },

  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },

  logo: {
    width: 62,
    height: 62,
  },

  brandName: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  brandSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#DCE7FA",
    textAlign: "center",
  },

  formCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -22,
    paddingHorizontal: 22,
    paddingTop: 27,
    paddingBottom: 25,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EDF1F7",
    elevation: 5,
    shadowColor: "#152C52",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 9,
    marginBottom: 25,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.muted,
  },

  fieldContainer: {
    marginBottom: 17,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 9,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  inputIcon: {
    marginRight: 11,
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
  },

  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },

  button: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },

  loginContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    gap: 5,
  },

  loginText: {
    color: COLORS.muted,
    fontSize: 13,
  },

  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    paddingHorizontal: 20,
    gap: 7,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 12,
  },
});
