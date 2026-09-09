import { ScrollView, StyleSheet, Alert } from "react-native";

import { router } from "expo-router";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

export default function Location() {
  const { listing, updateListing } = useListing();

  function handleChange(key, value) {
    updateListing({
      [key]: value,
    });
  }

  function handleNext() {
    if (!listing.region.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir la région.");
      return;
    }

    if (!listing.city.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir la ville.");
      return;
    }

    if (!listing.district.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir le quartier.");
      return;
    }

    if (!listing.address.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir l'adresse précise.");
      return;
    }

    console.log("Étape 2 validée :", listing);

    router.push("/publisher-create/features");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Localisation" showBack />

      <FormSection title="Adresse du logement">
        <FormInput
          label="Région"
          placeholder="Ex: Dakar"
          placeholderTextColor="#9CA3AF"
          value={listing.region}
          onChangeText={(text) => handleChange("region", text)}
        />

        <FormInput
          label="Ville"
          placeholder="Ex: Medina"
          placeholderTextColor="#9CA3AF"
          value={listing.city}
          onChangeText={(text) => handleChange("city", text)}
        />

        <FormInput
          label="Quartier"
          placeholder="Ex: Almadies"
          placeholderTextColor="#9CA3AF"
          value={listing.district}
          onChangeText={(text) => handleChange("district", text)}
        />

        <FormInput
          label="Adresse précise"
          placeholder="Rue, numéro..."
          placeholderTextColor="#9CA3AF"
          value={listing.address}
          onChangeText={(text) => handleChange("address", text)}
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

  placeholderText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
});
