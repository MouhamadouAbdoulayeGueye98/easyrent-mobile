import { useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { useToast } from "../../context/ToastContext";
import { resetPassword } from "../../services/auth";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  background: "#F4F7FC",
  white: "#FFFFFF",
  text: "#172033",
  muted: "#758198",
  border: "#E2E8F0",
};

export default function ResetPassword() {
  const { token } = useLocalSearchParams();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (loading) return;

    if (!token || Array.isArray(token)) {
      showToast("Le lien de réinitialisation est invalide.", "error");
      return;
    }

    if (!password || !confirmPassword) {
      showToast("Veuillez remplir tous les champs.", "error");
      return;
    }

    if (password.length < 6) {
      showToast(
        "Le mot de passe doit contenir au moins 6 caractères.",
        "error",
      );
      return;
    }

    if (password !== confirmPassword) {
      showToast("Les mots de passe ne correspondent pas.", "error");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, password);

      showToast("Mot de passe réinitialisé avec succès.", "success");

      router.replace("/auth/login");
    } catch (error) {
      console.error("Erreur réinitialisation mot de passe :", error);

      const apiMessage = error?.response?.data?.message;

      const message = Array.isArray(apiMessage)
        ? apiMessage.join("\n")
        : typeof apiMessage === "string"
          ? apiMessage
          : error?.message ||
            "Le lien de réinitialisation est invalide ou expiré.";

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
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.brand}>
            <View style={styles.logoContainer}>
              <Ionicons name="lock-closed" size={34} color={COLORS.primary} />
            </View>

            <Text style={styles.brandName}>Easy Rent</Text>

            <Text style={styles.brandSubtitle}>
              Sécurisez l’accès à votre compte
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.headingIcon}>
            <Ionicons name="key-outline" size={25} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Nouveau mot de passe</Text>

          <Text style={styles.subtitle}>
            Choisissez un nouveau mot de passe pour retrouver l’accès à votre
            compte Easy Rent.
          </Text>

          <Text style={styles.label}>Nouveau mot de passe</Text>

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
              editable={!loading}
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

          <Text style={[styles.label, styles.secondLabel]}>
            Confirmer le mot de passe
          </Text>

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
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword((previous) => !previous)}
              accessibilityLabel={
                showConfirmPassword
                  ? "Masquer la confirmation"
                  : "Afficher la confirmation"
              }
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={21}
                color={COLORS.muted}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.hint}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={COLORS.muted}
            />

            <Text style={styles.hintText}>Utilisez au moins 6 caractères.</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  Réinitialiser le mot de passe
                </Text>

                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => router.replace("/auth/login")}
            disabled={loading}
          >
            <Ionicons
              name="arrow-back-outline"
              size={17}
              color={COLORS.primary}
            />

            <Text style={styles.loginLink}>Retour à la connexion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color={COLORS.muted}
          />

          <Text style={styles.footerText}>
            Votre compte Easy Rent reste protégé.
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

  headingIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 10,
    marginBottom: 25,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.muted,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 9,
  },

  secondLabel: {
    marginTop: 19,
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
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

  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 13,
  },

  hintText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  button: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    marginTop: 23,
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
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    flexShrink: 1,
  },

  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 25,
    paddingVertical: 5,
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
    textAlign: "center",
  },
});
