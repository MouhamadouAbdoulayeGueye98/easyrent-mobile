import { ScrollView, StyleSheet } from "react-native";

import { router } from "expo-router";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

export default function Pricing() {
  const { listing, updateListing } = useListing();

  function handleChange(key, value) {
    updateListing({
      [key]: value,
    });
  }

  function handleNext() {
    console.log("Prix :", listing);


    router.push("/publisher-create/photos");
  }

  return (
    <ScrollView
      style={styles.container}

      contentContainerStyle={styles.content}

      showsVerticalScrollIndicator={false}
    >
      <Header title="Prix et disponibilité" showBack />

      <FormSection title="Informations financières">
        <FormInput
          label="Prix"
          placeholder="Ex: 250000 FCFA / mois"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={listing.price}
          onChangeText={(text) => handleChange("price", text)}
        />

        <FormInput
          label="Charges (optionnel)"
          placeholder="Ex: 15000 FCFA"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={listing.charges}
          onChangeText={(text) => handleChange("charges", text)}
        />

        <FormInput
          label="Caution"
          placeholder="Ex: 2 mois"
          placeholderTextColor="#9CA3AF"
          value={listing.deposit}
          onChangeText={(text) => handleChange("deposit", text)}
        />

        <FormInput
          label="Disponibilité"
          placeholder="Ex: Disponible immédiatement"
          placeholderTextColor="#9CA3AF"
          value={listing.availability}
          onChangeText={(text) => handleChange("availability", text)}
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
});
