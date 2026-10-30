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
import { router } from "expo-router";

import { useToast } from "../../context/ToastContext";
import { forgotPassword } from "../../services/auth";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  background: "#F4F7FC",
  white: "#FFFFFF",
  text: "#172033",
  muted: "#758198",
  border: "#E2E8F0",
};

export default function ForgotPassword() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendReset() {
    if (loading) return;

    const formattedEmail = email.trim();

    if (!formattedEmail) {
      showToast("Veuillez saisir votre adresse email.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formattedEmail)) {
      showToast("Veuillez saisir une adresse email valide.", "error");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(formattedEmail);

      setSent(true);

      showToast(
        `Un e-mail de réinitialisation a été envoyé à ${formattedEmail}.`,
        "success",
      );
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error);

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

          <Text style={styles.title}>Mot de passe oublié ?</Text>

          <Text style={styles.subtitle}>
            Saisissez l’adresse email associée à votre compte. Nous vous
            enverrons les instructions pour réinitialiser votre mot de passe.
          </Text>

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
              onChangeText={(value) => {
                setEmail(value);
                if (sent) setSent(false);
              }}
              style={styles.input}
              editable={!loading}
              returnKeyType="send"
              onSubmitEditing={handleSendReset}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendReset}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.buttonText}>Envoyer les instructions</Text>

                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>

          {sent && (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={22} color="#16A34A" />

              <Text style={styles.successText}>
                Demande envoyée. Vérifiez votre boîte mail ainsi que vos
                courriers indésirables.
              </Text>
            </View>
          )}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Vous vous souvenez de votre mot de passe ?
            </Text>

            <TouchableOpacity
              onPress={() => router.replace("/auth/login")}
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

  button: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    marginTop: 22,
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
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
  },

  loginContainer: {
    alignItems: "center",
    marginTop: 25,
    gap: 8,
  },

  loginText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
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
