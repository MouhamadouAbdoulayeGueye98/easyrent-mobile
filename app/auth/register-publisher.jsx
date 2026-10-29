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
import { registerPublisher,getUserRole,
} from "../../services/auth";

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

const PUBLISHER_OPTIONS = [
  { label: "Particulier", value: "individual" },
  { label: "Agence immobilière", value: "agency" },
  { label: "Promoteur immobilier", value: "promoter" },
  { label: "Résidence meublée", value: "residence" },
];

export default function RegisterPublisher() {
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [publisherType, setPublisherType] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPublisherTypes, setShowPublisherTypes] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (loading) return;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !city.trim() ||
      !publisherType ||
      !password ||
      !confirmPassword
    ) {
      showToast("Veuillez remplir tous les champs.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showToast("Veuillez saisir une adresse email valide.", "error");
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

      await registerPublisher({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        publisherType,
        password,
      });

      const profile = await getUserRole();

      if (profile) {
        setUser(profile);
      }

      showToast("Compte annonceur créé avec succès.", "success");

      router.replace("/publisher");
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

  function renderInput({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    autoCapitalize = "words",
    secureTextEntry,
    rightAction,
    returnKeyType = "next",
    onSubmitEditing,
  }) {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name={icon}
            size={20}
            color={COLORS.muted}
            style={styles.inputIcon}
          />

          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            secureTextEntry={secureTextEntry}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
          />

          {rightAction}
        </View>
      </View>
    );
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
        {/* En-tête identique à l'inscription client */}
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
              Publiez vos biens et trouvez vos locataires
            </Text>
          </View>
        </View>

        {/* Carte du formulaire */}
        <View style={styles.formCard}>
          <Text style={styles.title}>Créer un compte annonceur</Text>

          <Text style={styles.subtitle}>
            Rejoignez Easy Rent pour gérer et publier vos annonces immobilières.
          </Text>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons
                name="person-outline"
                size={19}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.sectionTitle}>
              Informations personnelles
            </Text>
          </View>

          {renderInput({
            label: "Prénom",
            icon: "person-outline",
            placeholder: "Votre prénom",
            value: firstName,
            onChangeText: setFirstName,
          })}

          {renderInput({
            label: "Nom",
            icon: "person-outline",
            placeholder: "Votre nom",
            value: lastName,
            onChangeText: setLastName,
          })}

          {renderInput({
            label: "Téléphone",
            icon: "call-outline",
            placeholder: "Votre numéro de téléphone",
            value: phone,
            onChangeText: setPhone,
            keyboardType: "phone-pad",
            autoCapitalize: "none",
          })}

          {renderInput({
            label: "Adresse email",
            icon: "mail-outline",
            placeholder: "exemple@email.com",
            value: email,
            onChangeText: setEmail,
            keyboardType: "email-address",
            autoCapitalize: "none",
          })}

          {renderInput({
            label: "Ville",
            icon: "location-outline",
            placeholder: "Ex. Dakar",
            value: city,
            onChangeText: setCity,
          })}

          {/* Type d'annonceur */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type d'annonceur</Text>

            <TouchableOpacity
              style={styles.inputContainer}
              activeOpacity={0.8}
              onPress={() => setShowPublisherTypes((previous) => !previous)}
            >
              <Ionicons
                name="business-outline"
                size={20}
                color={COLORS.muted}
                style={styles.inputIcon}
              />

              <Text
                style={[
                  styles.selectText,
                  !publisherType && styles.placeholderText,
                ]}
              >
                {PUBLISHER_OPTIONS.find(
                  (option) => option.value === publisherType
                )?.label || "Sélectionnez votre profil"}
              </Text>

              <Ionicons
                name={
                  showPublisherTypes
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={20}
                color={COLORS.muted}
              />
            </TouchableOpacity>

            {showPublisherTypes && (
              <View style={styles.optionsContainer}>
                {PUBLISHER_OPTIONS.map((option) => {
                  const selected = publisherType === option.value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.option,
                        selected && styles.optionSelected,
                      ]}
                      onPress={() => {
                        setPublisherType(option.value);
                        setShowPublisherTypes(false);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selected && styles.optionTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>

                      {selected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={19}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={19}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.sectionTitle}>
              Sécurité du compte
            </Text>
          </View>

          {renderInput({
            label: "Mot de passe",
            icon: "lock-closed-outline",
            placeholder: "6 caractères minimum",
            value: password,
            onChangeText: setPassword,
            autoCapitalize: "none",
            secureTextEntry: !showPassword,
            rightAction: (
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
            ),
          })}

          {renderInput({
            label: "Confirmer le mot de passe",
            icon: "shield-checkmark-outline",
            placeholder: "Retapez votre mot de passe",
            value: confirmPassword,
            onChangeText: setConfirmPassword,
            autoCapitalize: "none",
            secureTextEntry: !showConfirmPassword,
            returnKeyType: "done",
            onSubmitEditing: handleRegister,
            rightAction: (
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
            ),
          })}

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
                <Text style={styles.buttonText}>
                  Créer mon compte annonceur
                </Text>

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
            Vos informations sont utilisées pour créer votre compte.
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
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 9,
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.muted,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
    marginBottom: 18,
  },

  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
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

  selectText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 14,
  },

  placeholderText: {
    color: "#9CA3AF",
  },

  optionsContainer: {
    marginTop: 8,
    padding: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },

  option: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionSelected: {
    backgroundColor: "#EEF4FF",
  },

  optionText: {
    fontSize: 14,
    color: COLORS.text,
  },

  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "700",
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
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    flexShrink: 1,
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
    textAlign: "center",
    flexShrink: 1,
  },
});