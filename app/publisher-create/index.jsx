import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useToast } from "../../context/ToastContext";

import Header from "../../components/common/Header";
import FormButton from "../../components/forms/FormButton";
import FormInput from "../../components/forms/FormInput";
import FormSection from "../../components/forms/FormSection";
import { useListing } from "../../context/ListingContext";

const TOTAL_STEPS = 7;
const CURRENT_STEP = 1;

const COLORS = {
  primary: "#2563EB",
  primarySoft: "#EFF4FF",
  background: "#F5F7FB",
  surface: "#FFFFFF",
  border: "#E4E8F0",
  text: "#0F172A",
  muted: "#64748B",
};

const propertyTypes = [
  { label: "Appartement", value: "APPARTEMENT", icon: "business-outline" },
  { label: "Studio", value: "STUDIO", icon: "home-outline" },
  { label: "Chambre", value: "CHAMBRE", icon: "bed-outline" },
  { label: "Colocation", value: "COLOCATION", icon: "people-outline" },
];

const listingTypes = [
  { label: "Location", value: "LOCATION", icon: "key-outline" },
  { label: "Vente", value: "VENTE", icon: "pricetag-outline" },
];

function ProgressSteps({ hint }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Étape {CURRENT_STEP} sur {TOTAL_STEPS}
        </Text>
        <Text style={styles.progressHint}>{hint}</Text>
      </View>

      <View style={styles.segments}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            style={[styles.segment, index < CURRENT_STEP && styles.segmentDone]}
          />
        ))}
      </View>
    </View>
  );
}

export default function CreateListing() {
  const { listing, updateListing } = useListing();
  const { showToast } = useToast();

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

    console.log("TYPE LOGEMENT :", value);
  }

  function selectListingType(value) {
    updateListing({
      listingType: value,
    });

    console.log("TYPE ANNONCE :", value);
  }

  function handleNext() {
    if (!listing.title.trim()) {
      showToast("Veuillez saisir le titre du logement.", "error");
      return;
    }

    if (!listing.propertyType) {
      showToast("Veuillez choisir le type de logement.", "error");
      return;
    }

    if (!listing.listingType) {
      showToast("Veuillez choisir le type d'annonce.", "error");
      return;
    }

    if (!listing.description.trim()) {
      showToast("Veuillez saisir une description du logement.", "error");
      return;
    }

    console.log("Étape 1 validée :", listing);

    router.push("/publisher-create/location");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Header title="Ajouter un logement" showBack />

      <ProgressSteps hint="Informations générales" />

      <FormSection title="Informations générales">
        {/* TITRE */}
        <FormInput
          label="Titre du logement"
          placeholder="Ex : Appartement F4 aux Almadies"
          placeholderTextColor="#94A3B8"
          value={listing.title}
          onChangeText={(text) => handleChange("title", text)}
        />

        {/* TYPE D'ANNONCE */}
        <View style={styles.group}>
          <Text style={styles.label}>Type d'annonce</Text>

          <View style={styles.segmented}>
            {listingTypes.map((item) => {
              const active = listing.listingType === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.segmentOption, active && styles.segmentActive]}
                  onPress={() => selectListingType(item.value)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={active ? "#FFFFFF" : COLORS.muted}
                  />
                  <Text
                    style={[
                      styles.segmentText,
                      active && styles.segmentTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* TYPE DE LOGEMENT */}
        <View style={styles.group}>
          <Text style={styles.label}>Type de logement</Text>

          <View style={styles.grid}>
            {propertyTypes.map((item) => {
              const active = listing.propertyType === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.tile, active && styles.tileActive]}
                  onPress={() => selectPropertyType(item.value)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <View
                    style={[styles.tileIcon, active && styles.tileIconActive]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={active ? "#FFFFFF" : COLORS.primary}
                    />
                  </View>

                  <Text
                    style={[styles.tileText, active && styles.tileTextActive]}
                  >
                    {item.label}
                  </Text>

                  {active && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={COLORS.primary}
                      style={styles.tileCheck}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* DESCRIPTION */}
        <FormInput
          label="Description"
          placeholder="Décrivez votre logement..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={5}
          value={listing.description}
          onChangeText={(text) => handleChange("description", text)}
        />
        <Text style={styles.helper}>
          Indiquez le quartier, l'état du logement et les équipements.
        </Text>
      </FormSection>

      <FormButton title="Suivant" onPress={handleNext} />
    </ScrollView>
  );
}

const tileShadow = Platform.select({
  ios: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  android: { elevation: 1 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Progression */
  progressContainer: {
    marginBottom: 28,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },

  progressText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  progressHint: {
    fontSize: 13,
    color: COLORS.muted,
  },

  segments: {
    flexDirection: "row",
    gap: 6,
  },

  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },

  segmentDone: {
    backgroundColor: COLORS.primary,
  },

  /* Groupes */
  group: {
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },

  /* Contrôle segmenté : Location / Vente */
  segmented: {
    flexDirection: "row",
    backgroundColor: "#E9EDF5",
    borderRadius: 14,
    padding: 4,
  },

  segmentOption: {
    flex: 1,
    height: 46,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  segmentActive: {
    backgroundColor: COLORS.primary,
  },

  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.muted,
  },

  segmentTextActive: {
    color: "#FFFFFF",
  },

  /* Tuiles : type de logement */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  tile: {
    width: "48%",
    flexGrow: 1,
    flexBasis: "46%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    padding: 14,
    gap: 12,
    ...tileShadow,
  },

  tileActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },

  tileIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  tileIconActive: {
    backgroundColor: COLORS.primary,
  },

  tileText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },

  tileTextActive: {
    color: COLORS.primary,
  },

  tileCheck: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  helper: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: -6,
    marginBottom: 8,
  },
});
