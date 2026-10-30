import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { propertyTypes } from "../../constants/propertyTypes";
import { COLORS } from "../../constants/colors";

const ALL_TYPES = [{ label: "Tous", value: "TOUS" }, ...propertyTypes];

const onlyDigits = (value) => value.replace(/[^0-9]/g, "");

export default function PropertyFilterModal({
  onClose,
  onApply,
  type = "TOUS",
  minPrice = "",
  maxPrice = "",
}) {
  const [draftType, setDraftType] = useState(type);
  const [draftMinPrice, setDraftMinPrice] = useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = useState(maxPrice);

  const applyAndClose = (nextType, nextMinPrice, nextMaxPrice) => {
    onApply({
      type: nextType,
      minPrice: nextMinPrice,
      maxPrice: nextMaxPrice,
    });
    onClose();
  };

  const handleApply = () => {
    if (
      draftMinPrice !== "" &&
      draftMaxPrice !== "" &&
      Number(draftMinPrice) > Number(draftMaxPrice)
    ) {
      Alert.alert(
        "Filtres invalides",
        "Le prix minimum doit être inférieur au prix maximum.",
      );
      return;
    }

    applyAndClose(draftType, draftMinPrice, draftMaxPrice);
  };

  const handleReset = () => {
    applyAndClose("TOUS", "", "");
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Filtrer les annonces</Text>

            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Type de logement</Text>

            <View style={styles.chips}>
              {ALL_TYPES.map((item) => {
                const selected = draftType === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setDraftType(item.value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Budget en FCFA</Text>

            <View style={styles.priceRow}>
              <View style={styles.priceField}>
                <Text style={styles.priceLabel}>Minimum</Text>
                <TextInput
                  style={styles.input}
                  value={draftMinPrice}
                  onChangeText={(value) => setDraftMinPrice(onlyDigits(value))}
                  placeholder="Ex: 50000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.priceField}>
                <Text style={styles.priceLabel}>Maximum</Text>
                <TextInput
                  style={styles.input}
                  value={draftMaxPrice}
                  onChangeText={(value) => setDraftMaxPrice(onlyDigits(value))}
                  placeholder="Ex: 250000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.resetText}>Réinitialiser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.8}
              >
                <Text style={styles.applyText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    maxHeight: "85%",
    elevation: 12,
  },

  handle: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 18,
    marginBottom: 10,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },

  chipTextSelected: {
    color: "#FFFFFF",
  },

  priceRow: {
    flexDirection: "row",
    gap: 12,
  },

  priceField: {
    flex: 1,
  },

  priceLabel: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
    color: "#111827",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 26,
  },

  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  resetText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },

  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  applyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
