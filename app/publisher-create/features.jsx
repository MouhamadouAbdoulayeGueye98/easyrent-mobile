import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";

import { router } from "expo-router";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

export default function Features() {
  const { listing, updateListing } = useListing();

  function updateNumber(key, value) {
    updateListing({
      [key]: Math.max(0, listing[key] + value),
    });
  }

  function handleChange(key, value) {
    updateListing({
      [key]: value,
    });
  }

  function handleNext() {
    // Vérification de la surface
    if (!listing.area.trim()) {
      Alert.alert(
        "Champ obligatoire",
        "Veuillez saisir la surface du logement.",
      );
      return;
    }

    // Conversion pour vérifier que c'est bien un nombre
    const surface = Number(listing.area);

    if (isNaN(surface) || surface <= 0) {
      Alert.alert("Surface invalide", "Veuillez saisir une surface valide.");
      return;
    }

    console.log("Étape 3 :", {
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      area: listing.area,
      furnished: listing.furnished,
    });

    router.push("/publisher-create/pricing");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Caractéristiques" showBack />

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Étape 3 sur 7</Text>

        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
      </View>

      <FormSection title="Informations du logement">
        {/* CHAMBRES */}
        <View style={styles.counterContainer}>
          <Text style={styles.label}>Chambres</Text>

          <View style={styles.counter}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateNumber("bedrooms", -1)}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.value}>{listing.bedrooms}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => updateNumber("bedrooms", 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SALLES DE BAIN */}
        <View style={styles.counterContainer}>
          <Text style={styles.label}>Salles de bain</Text>

          <View style={styles.counter}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateNumber("bathrooms", -1)}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.value}>{listing.bathrooms}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => updateNumber("bathrooms", 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SURFACE */}
        <FormInput
          label="Surface (m²)"
          placeholder="Ex: 120"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          value={listing.area}
          onChangeText={(text) => handleChange("area", text)}
        />

        {/* MEUBLÉ */}
        <TouchableOpacity
          style={[
            styles.furnished,
            listing.furnished && styles.furnishedActive,
          ]}
          onPress={() => handleChange("furnished", !listing.furnished)}
        >
          <Text style={styles.furnishedText}>
            {listing.furnished ? "✓ Logement meublé" : "Logement non meublé"}
          </Text>
        </TouchableOpacity>
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
    width: "43%",
    height: "100%",
    backgroundColor: "#2563EB",
  },

  counterContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111827",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
  },

  button: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    minWidth: 30,
    textAlign: "center",
  },

  furnished: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },

  furnishedActive: {
    backgroundColor: "#D1FAE5",
  },

  furnishedText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
});
