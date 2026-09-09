import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";

import Header from "../../components/common/Header";
import FormButton from "../../components/forms/FormButton";
import FormInput from "../../components/forms/FormInput";
import FormSection from "../../components/forms/FormSection";
import { useListing } from "../../context/ListingContext";

export default function CreateListing() {
  const { listing, updateListing } = useListing();

  const [showPropertyTypes, setShowPropertyTypes] = useState(false);
  const [showListingTypes, setShowListingTypes] = useState(false);

  const propertyTypes = [
    {
      label: "Appartement",
      value: "APPARTEMENT",
    },
    {
      label: "Studio",
      value: "STUDIO",
    },
    {
      label: "Chambre",
      value: "CHAMBRE",
    },
    {
      label: "Colocation",
      value: "COLOCATION",
    },
  ];

  const listingTypes = [
    {
      label: "Location",
      value: "LOCATION",
    },
    {
      label: "Vente",
      value: "VENTE",
    },
  ];

  function handleChange(key, value) {
    console.log("CHANGE :", key, value);

    updateListing({
      [key]: value,
    });
  }

  function selectPropertyType(value) {
    updateListing({
      propertyType: value,
    });

    setShowPropertyTypes(false);

    console.log("TYPE LOGEMENT :", value);
  }

  function selectListingType(value) {
    updateListing({
      listingType: value,
    });

    setShowListingTypes(false);

    console.log("TYPE ANNONCE :", value);
  }

  function handleNext() {
    if (!listing.title.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir le titre du logement.");
      return;
    }

    if (!listing.propertyType) {
      Alert.alert("Champ obligatoire", "Veuillez choisir le type de logement.");
      return;
    }

    if (!listing.listingType) {
      Alert.alert("Champ obligatoire", "Veuillez choisir le type d'annonce.");
      return;
    }

    if (!listing.description.trim()) {
      Alert.alert(
        "Champ obligatoire",
        "Veuillez saisir une description du logement.",
      );
      return;
    }

    console.log("Étape 1 validée :", listing);

    router.push("/publisher-create/location");
  }

  const selectedProperty = propertyTypes.find(
    (item) => item.value === listing.propertyType,
  );

  const selectedListing = listingTypes.find(
    (item) => item.value === listing.listingType,
  );

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
        {/* Titre */}

        <FormInput
          label="Titre du logement"
          placeholder="Ex: Appartement F4 aux Almadies"
          value={listing.title}
          onChangeText={(text) => handleChange("title", text)}
        />

        {/* TYPE DE LOGEMENT */}

        <View style={styles.selectContainer}>
          <Text style={styles.label}>Type de logement</Text>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setShowPropertyTypes(!showPropertyTypes);
              setShowListingTypes(false);
            }}
          >
            <Text
              style={
                selectedProperty ? styles.selectedText : styles.placeholderText
              }
            >
              {selectedProperty ? selectedProperty.label : "Choisir un type"}
            </Text>

            <Text style={styles.arrow}>{showPropertyTypes ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showPropertyTypes && (
            <View style={styles.optionsContainer}>
              {propertyTypes.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => selectPropertyType(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>

                  {listing.propertyType === item.value && (
                    <Text style={styles.check}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* TYPE D'ANNONCE */}

        <View style={styles.selectContainer}>
          <Text style={styles.label}>Type d'annonce</Text>

          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              setShowListingTypes(!showListingTypes);
              setShowPropertyTypes(false);
            }}
          >
            <Text
              style={
                selectedListing ? styles.selectedText : styles.placeholderText
              }
            >
              {selectedListing ? selectedListing.label : "Choisir un type"}
            </Text>

            <Text style={styles.arrow}>{showListingTypes ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showListingTypes && (
            <View style={styles.optionsContainer}>
              {listingTypes.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.option}
                  onPress={() => selectListingType(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>

                  {listing.listingType === item.value && (
                    <Text style={styles.check}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* DESCRIPTION */}

        <FormInput
          label="Description"
          placeholder="Décrivez votre logement..."
          multiline
          numberOfLines={5}
          value={listing.description}
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

  selectContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  selectButton: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  placeholderText: {
    color: "#9CA3AF",
    fontSize: 16,
  },

  selectedText: {
    color: "#111827",
    fontSize: 16,
  },

  arrow: {
    fontSize: 12,
    color: "#6B7280",
  },

  optionsContainer: {
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
  },

  option: {
    minHeight: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  optionText: {
    fontSize: 16,
    color: "#111827",
  },

  check: {
    fontSize: 18,
    color: "#2563EB",
    fontWeight: "700",
  },
});
