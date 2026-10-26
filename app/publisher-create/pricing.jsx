import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

const TOTAL_STEPS = 7;
const CURRENT_STEP = 5;

const COLORS = {
  primary: "#2563EB",
  primarySoft: "#EFF4FF",
  background: "#F5F7FB",
  surface: "#FFFFFF",
  border: "#E4E8F0",
  text: "#0F172A",
  muted: "#64748B",
};

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
            style={[
              styles.segment,
              index < CURRENT_STEP && styles.segmentDone,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function PricingInfo({ icon, title, description }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoDescription}>{description}</Text>
      </View>
    </View>
  );
}

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
      keyboardShouldPersistTaps="handled"
    >
      <Header title="Prix et disponibilité" showBack />

      <ProgressSteps hint="Tarification" />

      <View style={styles.intro}>
        <View style={styles.introIcon}>
          <Ionicons
            name="wallet-outline"
            size={28}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.introTitle}>
          Définissez votre tarif
        </Text>

        <Text style={styles.introDescription}>
          Renseignez les informations financières et la disponibilité
          de votre logement.
        </Text>
      </View>

      <FormSection title="Informations financières">
        <FormInput
          label="Prix"
          placeholder="Ex : 250000 FCFA / mois"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={listing.price}
          onChangeText={(text) => handleChange("price", text)}
        />

        <Text style={styles.helper}>
          Indiquez le prix demandé pour votre logement.
        </Text>

        <FormInput
          label="Charges (optionnel)"
          placeholder="Ex : 15000 FCFA"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={listing.charges}
          onChangeText={(text) => handleChange("charges", text)}
        />

        <FormInput
          label="Caution"
          placeholder="Ex : 2 mois"
          placeholderTextColor="#94A3B8"
          value={listing.deposit}
          onChangeText={(text) => handleChange("deposit", text)}
        />

        <FormInput
          label="Disponibilité"
          placeholder="Ex : Disponible immédiatement"
          placeholderTextColor="#94A3B8"
          value={listing.availability}
          onChangeText={(text) => handleChange("availability", text)}
        />
      </FormSection>

      <View style={styles.tipsCard}>
        <View style={styles.tipsHeader}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color={COLORS.primary}
          />
          <Text style={styles.tipsTitle}>Conseils pour votre annonce</Text>
        </View>

        <PricingInfo
          icon="cash-outline"
          title="Un prix clair"
          description="Précisez le montant et la périodicité du loyer ou le prix de vente."
        />

        <PricingInfo
          icon="receipt-outline"
          title="Des charges transparentes"
          description="Mentionnez les charges supplémentaires pour informer les futurs locataires."
        />

        <PricingInfo
          icon="calendar-outline"
          title="Une disponibilité précise"
          description="Indiquez à partir de quand votre logement peut être occupé."
        />
      </View>

      <FormButton title="Suivant" onPress={handleNext} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  progressContainer: {
    marginBottom: 26,
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

  intro: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    marginBottom: 24,
  },

  introIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },

  introDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: "center",
  },

  helper: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: -10,
    marginBottom: 18,
  },

  tipsCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE7FF",
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    gap: 18,
  },

  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  tipsTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  infoContent: {
    flex: 1,
    paddingTop: 2,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },

  infoDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.muted,
  },
});