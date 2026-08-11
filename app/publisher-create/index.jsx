import { ScrollView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";
import { useState } from "react";

import Header from "../../components/common/Header";
import FormButton from "../../components/forms/FormButton";
import FormInput from "../../components/forms/FormInput";
import FormSection from "../../components/forms/FormSection";
import PickerInput from "../../components/forms/PickerInput";

import { listingTypes } from "../../constants/listingTypes";
import { propertyTypes } from "../../constants/propertyTypes";

export default function CreateListing() {
  const [form, setForm] = useState({
    title: "",
    propertyType: "",
    listingType: "",
    description: "",
  });

  function handleChange(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleNext() {
    console.log("Etape 1 :", form);

    // prochaine étape plus tard
    router.push("/publisher-create/location");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Ajouter un logement" showBack />

      {/* Progression */}

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Étape 1 sur 7</Text>

        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
      </View>

      <FormSection title="Informations générales">
        <FormInput
          label="Titre du logement"
          placeholder="Ex: Appartement F4 aux Almadies"
          value={form.title}
          onChangeText={(text) => handleChange("title", text)}
        />

        <PickerInput
          label="Type de logement"
          placeholder="Choisir un type"
          value={form.propertyType}
          items={propertyTypes}
          onValueChange={(value) => handleChange("propertyType", value)}
        />

        <PickerInput
          label="Type d'annonce"
          placeholder="Choisir"
          value={form.listingType}
          items={listingTypes}
          onValueChange={(value) => handleChange("listingType", value)}
        />

        <FormInput
          label="Description"
          placeholder="Décrivez votre logement..."
          multiline
          numberOfLines={5}
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
        />
      </FormSection>

      <FormButton title="Suivant" onPress={handleNext} />
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

  progressContainer: {
    marginBottom: 25,
  },

  progressText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 10,
  },

  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  progress: {
    width: "14%",
    height: "100%",
    backgroundColor: "#2563EB",
  },
});
