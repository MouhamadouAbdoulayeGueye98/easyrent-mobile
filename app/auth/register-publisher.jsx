import { useState } from "react";

import { ScrollView, StyleSheet, Alert } from "react-native";

import { router } from "expo-router";

import Header from "../../components/common/Header";

import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import FormSection from "../../components/forms/FormSection";
import SelectInput from "../../components/forms/SelectInput";
import { useAuth } from "../../context/AuthContext";
import { registerPublisher, getUserRole } from "../../services/auth";

const publisherOptions = [
  {
    label: "Particulier",
    value: "individual",
  },

  {
    label: "Agence immobilière",
    value: "agency",
  },

  {
    label: "Promoteur immobilier",
    value: "promoter",
  },

  {
    label: "Résidence meublée",
    value: "residence",
  },
];

export default function RegisterPublisher() {
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",

    phone: "",

    email: "",

    city: "",

    publisherType: "",

    password: "",

    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleRegister() {
    const {
      firstName,
      lastName,
      phone,
      email,
      city,
      publisherType,
      password,
      confirmPassword,
    } = form;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !city ||
      !publisherType ||
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

      await registerPublisher({firstName, lastName, phone, email, city, publisherType, password,
      });
      const profile = await getUserRole();
      if (profile) setUser(profile);
      Alert.alert("Succès", "Compte annonceur créé.");

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erreur", error.message);
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
      <Header title="Créer un compte annonceur" showBack />

      <FormSection title="Informations personnelles">
        <FormInput
          label="Prénom"
          placeholder="Votre prénom"
          placeholderTextColor="#9CA3AF"
          value={form.firstName}
          onChangeText={(text) => handleChange("firstName", text)}
        />

        <FormInput
          label="Nom"
          placeholder="Votre nom"
          placeholderTextColor="#9CA3AF"
          value={form.lastName}
          onChangeText={(text) => handleChange("lastName", text)}
        />

        <FormInput
          label="Téléphone"
          placeholder="77 123 45 67"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange("phone", text)}
        />

        <FormInput
          label="Email"
          placeholder="email@gmail.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <FormInput
          label="Ville"
          placeholder="Dakar"
          placeholderTextColor="#9CA3AF"
          value={form.city}
          onChangeText={(text) => handleChange("city", text)}
        />

        <SelectInput
          label="Type d'annonceur"
          placeholder="Choisir un type"
          placeholderTextColor="#9CA3AF"
          value={
            publisherOptions.find((item) => item.value === form.publisherType)
              ?.label
          }
          options={publisherOptions}
          onSelect={(value) => handleChange("publisherType", value)}
        />
      </FormSection>

      <FormSection title="Sécurité">
        <FormInput
          label="Mot de passe"
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
        />

        <FormInput
          label="Confirmer le mot de passe"
          placeholder="********"
          placeholderTextColor="#4d4e4f"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
        />
      </FormSection>

      <FormButton
        title="Créer mon compte"

        loading={loading}

        onPress={handleRegister}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
