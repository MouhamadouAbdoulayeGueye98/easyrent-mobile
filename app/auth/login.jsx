
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StatusBar,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { login, getUserRole } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  background: "#F4F7FC",
  white: "#FFFFFF",
  text: "#172033",
  muted: "#77839A",
  border: "#E1E7F0",
  inputBackground: "#F9FAFD",
  link: "#245BC5",
};

export default function Login() {
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      showToast(
        "Veuillez renseigner votre adresse e-mail et votre mot de passe.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await login(email.trim(), password);

      if (response?.access_token) {
        await AsyncStorage.setItem(
          "access_token",
          response.access_token
        );
      }

      const profile = await getUserRole();

      if (profile) {
        setUser(profile);
      }

      const userRole = profile?.role || response?.user?.role;

      if (
        userRole === "publisher" ||
        userRole === "ANNONCEUR"
      ) {
        router.replace("/publisher");
      } else if (userRole === "ADMIN") {
        router.replace("/(tabs)");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);

      const serverMessage = error.response?.data?.message;

      const message = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage || "E-mail ou mot de passe incorrect.";

      showToast(String(message), "error");
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/(tabs)")}
            accessibilityRole="button"
            accessibilityLabel="Retour à l'accueil"
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.brand}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/easyrent-icon-1024.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.brandName}>
              Easy <Text style={styles.brandAccent}>Rent</Text>
            </Text>
          </View>

          <Text style={styles.headerTitle}>Bienvenue chez vous.</Text>

          <Text style={styles.headerSubtitle}>
            Connectez-vous pour retrouver vos annonces et vos favoris.
          </Text>

          <View style={styles.headerDecorationOne} />
          <View style={styles.headerDecorationTwo} />
        </View>

        {/* Formulaire */}
        <View style={styles.formContainer}>
          <View style={styles.headingContainer}>
            <Text style={styles.formTitle}>Connexion</Text>

            <Text style={styles.formSubtitle}>
              Accédez à votre espace personnel.
            </Text>
          </View>

          {/* E-mail */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Adresse e-mail</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.muted}
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="exemple@email.com"
                placeholderTextColor="#A0A9B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                editable={!loading}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Mot de passe */}
          <View style={styles.fieldContainer}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Mot de passe</Text>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.muted}
                style={styles.inputIcon}
              />

              <TextInput
                placeholder="Saisissez votre mot de passe"
                placeholderTextColor="#A0A9B8"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="current-password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                editable={!loading}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                disabled={loading}
                accessibilityRole="button"
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

          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => router.push("/auth/forgot-password")}
            disabled={loading}
          >
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {/* Bouton de connexion */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Se connecter</Text>

                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>

          {/* Inscription */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Vous n'avez pas encore de compte ?
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/auth/register")}
              disabled={loading}
            >
              <Text style={styles.registerLink}>Créer un compte</Text>
            </TouchableOpacity>
          </View>

          {/* Pied de page */}
          <View style={styles.footer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={16}
              color={COLORS.muted}
            />

            <Text style={styles.footerText}>
              Votre espace, en toute simplicité.
            </Text>
          </View>
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

  scrollContent: {
    flexGrow: 1,
  },

  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === "android" ? 52 : 62,
    paddingHorizontal: 26,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    zIndex: 2,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    zIndex: 1,
  },

  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },
  logo: {
    width: 56,
    height: 56,
  },

  brandName: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  brandAccent: {
    color: "#8DB8FF",
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.7,
    marginBottom: 10,
    zIndex: 1,
  },

  headerSubtitle: {
    color: "#D0DDF5",
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 310,
    zIndex: 1,
  },

  headerDecorationOne: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(75,129,218,0.13)",
    right: -55,
    top: 55,
  },

  headerDecorationTwo: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(141,184,255,0.09)",
    right: 65,
    bottom: -45,
  },

  formContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 32,
    paddingBottom: 24,
  },

  headingContainer: {
    marginBottom: 27,
  },

  formTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },

  formSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
  },

  passwordLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputContainer: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.text,
    fontSize: 14,
    paddingVertical: 16,
  },

  eyeButton: {
    padding: 7,
    marginLeft: 4,
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -5,
    marginBottom: 27,
    paddingVertical: 5,
  },

  forgotText: {
    color: COLORS.link,
    fontSize: 13,
    fontWeight: "700",
  },

  submitButton: {
    minHeight: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },

  registerContainer: {
    alignItems: "center",
    marginTop: 28,
    gap: 9,
  },

  registerText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
  },

  registerLink: {
    color: COLORS.link,
    fontSize: 14,
    fontWeight: "800",
    paddingVertical: 4,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    gap: 7,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 12,
  },
});
