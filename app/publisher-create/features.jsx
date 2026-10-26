import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Switch,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

const TOTAL_STEPS = 7;
const CURRENT_STEP = 3;
const MAX_COUNT = 20;

const COLORS = {
  primary: "#2563EB",
  primarySoft: "#EFF4FF",
  background: "#F5F7FB",
  surface: "#FFFFFF",
  border: "#E4E8F0",
  text: "#0F172A",
  muted: "#64748B",
  success: "#059669",
  successSoft: "#E7F7F0",
};

function ProgressSteps() {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Étape {CURRENT_STEP} sur {TOTAL_STEPS}
        </Text>
        <Text style={styles.progressHint}>Caractéristiques</Text>
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

function CounterRow({ icon, label, hint, value, onChange }) {
  const canDecrease = value > 0;
  const canIncrease = value < MAX_COUNT;

  return (
    <View style={styles.row}>
      <View style={styles.iconBubble}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>

      <View style={styles.counter}>
        <TouchableOpacity
          style={[styles.stepButton, !canDecrease && styles.stepButtonOff]}
          onPress={() => onChange(-1)}
          disabled={!canDecrease}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Retirer : ${label}`}
        >
          <Ionicons
            name="remove"
            size={20}
            color={canDecrease ? COLORS.primary : "#CBD5E1"}
          />
        </TouchableOpacity>

        <Text style={styles.value}>{value}</Text>

        <TouchableOpacity
          style={[styles.stepButton, styles.stepButtonPlus]}
          onPress={() => onChange(1)}
          disabled={!canIncrease}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Ajouter : ${label}`}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Features() {
  const { listing, updateListing } = useListing();

  function updateNumber(key, value) {
    updateListing({
      [key]: Math.min(MAX_COUNT, Math.max(0, listing[key] + value)),
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
      keyboardShouldPersistTaps="handled"
    >
      <Header title="Caractéristiques" showBack />

      <ProgressSteps />

      <FormSection title="Informations du logement">
        <View style={styles.card}>
          <CounterRow
            icon="bed-outline"
            label="Chambres"
            hint="Pièces pour dormir"
            value={listing.bedrooms}
            onChange={(delta) => updateNumber("bedrooms", delta)}
          />

          <View style={styles.divider} />

          <CounterRow
            icon="water-outline"
            label="Salles de bain"
            hint="Douches et bains"
            value={listing.bathrooms}
            onChange={(delta) => updateNumber("bathrooms", delta)}
          />
        </View>

        {/* SURFACE */}
        <FormInput
          label="Surface (m²)"
          placeholder="Ex : 120"
          placeholderTextColor="#94A3B8"
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
          activeOpacity={0.8}
          accessibilityRole="switch"
          accessibilityState={{ checked: !!listing.furnished }}
        >
          <View
            style={[
              styles.iconBubble,
              listing.furnished && styles.iconBubbleActive,
            ]}
          >
            <Ionicons
              name={listing.furnished ? "checkmark" : "home-outline"}
              size={22}
              color={listing.furnished ? COLORS.success : COLORS.primary}
            />
          </View>

          <View style={styles.rowText}>
            <Text style={styles.label}>
              {listing.furnished ? "Logement meublé" : "Logement non meublé"}
            </Text>
            <Text style={styles.hint}>
              {listing.furnished
                ? "Les meubles sont inclus dans la location"
                : "Le locataire apporte ses meubles"}
            </Text>
          </View>

          <Switch
            value={!!listing.furnished}
            onValueChange={(val) => handleChange("furnished", val)}
            trackColor={{ false: "#CBD5E1", true: COLORS.success }}
            thumbColor="#FFFFFF"
          />
        </TouchableOpacity>
      </FormSection>

      <FormButton title="Suivant" onPress={handleNext} />
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: { elevation: 2 },
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

  /* Cartes */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 20,
    ...cardShadow,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBubbleActive: {
    backgroundColor: COLORS.successSoft,
  },

  rowText: {
    flex: 1,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },

  hint: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },

  /* Compteur */
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  stepButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  stepButtonOff: {
    borderColor: COLORS.border,
    backgroundColor: "#F8FAFC",
  },

  stepButtonPlus: {
    backgroundColor: COLORS.primary,
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    minWidth: 26,
    textAlign: "center",
  },

  /* Meublé */
  furnished: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    marginTop: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  furnishedActive: {
    borderColor: COLORS.success,
    backgroundColor: "#F3FBF7",
  },
});
