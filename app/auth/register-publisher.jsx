import { useState } from "react";
import { ScrollView, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { z } from "zod";

import Header from "../../components/common/Header";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import FormSection from "../../components/forms/FormSection";
import SelectInput from "../../components/forms/SelectInput";
import { useAuth } from "../../context/AuthContext";

import { useRegisterPublisherMutation } from "../../services/api";

const registerPublisherSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
  city: z.string().min(2, "La ville est requise"),
  publisherType: z.string().min(1, "Veuillez choisir un type d'annonceur"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const publisherOptions = [
  { label: "Particulier", value: "individual" },
  { label: "Agence immobilière", value: "agency" },
  { label: "Promoteur immobilier", value: "promoter" },
  { label: "Résidence meublée", value: "residence" },
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

  // 2. Utilisation de la mutation RTK Query (qui gère aussi le loading automatiquement)
  const [registerPublisherMutation, { isLoading: loading }] = useRegisterPublisherMutation();

  function handleChange(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleRegister() {
    const validationResult = registerPublisherSchema.safeParse(form);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0].message;
      Alert.alert("Erreur de validation", firstError);
      return;
    }

    try {
      const cleanData = validationResult.data;

      // 3. Appel de l'API centralisée via RTK Query
      const response = await registerPublisherMutation({
        firstName: cleanData.firstName,
        lastName: cleanData.lastName,
        phone: cleanData.phone,
        email: cleanData.email,
        city: cleanData.city,
        publisherType: cleanData.publisherType,
        password: cleanData.password,
      }).unwrap();

      // Si ton API renvoie l'utilisateur ou le token, tu peux l'ajuster ici
      if (response) {
        setUser(response); // ou response.user selon ton backend
      }
      
      Alert.alert("Succès", "Compte annonceur créé.");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erreur", error?.data?.message || "Une erreur est survenue lors de l'inscription.");
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