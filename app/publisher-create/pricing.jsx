import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
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


function SelectField({ label, value, placeholder, options, onSelect }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Text style={styles.selectLabel}>{label}</Text>

      <Pressable
        style={styles.selectInput}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.selectValue,
            !value && styles.selectPlaceholder,
          ]}
        >
          {value || placeholder}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color={COLORS.muted}
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <Pressable
            style={styles.optionsCard}
            onPress={(event) => event.stopPropagation()}
          >
            <View style={styles.optionsHeader}>
              <Text style={styles.optionsTitle}>{label}</Text>

              <Pressable onPress={() => setVisible(false)}>
                <Ionicons
                  name="close-circle-outline"
                  size={26}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>

            {options.map((option) => {
              const selected = value === option;

              return (
                <Pressable
                  key={option}
                  style={[
                    styles.optionRow,
                    selected && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={21}
                      color={COLORS.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
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
          <Ionicons name="wallet-outline" size={28} color={COLORS.primary} />
        </View>

        <Text style={styles.introTitle}>Définissez votre tarif</Text>

        <Text style={styles.introDescription}>
          Renseignez les informations financières et la disponibilité de votre
          logement.
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
          label="Caution"
          placeholder="Ex : 2 mois"
          placeholderTextColor="#94A3B8"
          value={listing.deposit}
          onChangeText={(text) => handleChange("deposit", text)}
        />


        <SelectField
          label="Charges supplémentaires (optionnel)"
          placeholder="Sélectionnez les charges"
          value={listing.charges || ""}
          options={[
            "Aucune charge supplémentaire",
            "Eau",
            "Électricité",
            "Eau et électricité",
            "Eau, électricité et autres charges",
            "Autres charges",
          ]}
          onSelect={(value) => handleChange("charges", value)}
        />

        <View style={styles.selectSpacing} />

        <SelectField
          label="Disponibilité du logement"
          placeholder="Sélectionnez la disponibilité"
          value={listing.availability || ""}
          options={[
            "Disponible immédiatement",
            "Disponible sous 7 jours",
            "Disponible sous 15 jours",
            "Disponible sous 1 mois",
            "Indisponible temporairement",
          ]}
          onSelect={(value) => handleChange("availability", value)}
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

  selectLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 9,
  },

  selectInput: {
    minHeight: 54,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingRight: 10,
  },

  selectPlaceholder: {
    color: "#94A3B8",
  },

  selectSpacing: {
    height: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 22,
  },

  optionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
  },

  optionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  optionsTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginRight: 10,
  },

  optionRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderRadius: 11,
    marginBottom: 5,
  },

  optionSelected: {
    backgroundColor: COLORS.primarySoft,
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingRight: 10,
  },

  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});