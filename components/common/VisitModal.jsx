
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const COLORS = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  background: "#F8FAFC",
  white: "#FFFFFF",
  title: "#0F172A",
  text: "#475569",
  muted: "#94A3B8",
  border: "#E2E8F0",
  success: "#16A34A",
  danger: "#DC2626",
};

export default function VisitModal({
  visible,
  onClose,
  onSubmit,
  propertyTitle,
}) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (visible) {
      setDate(new Date());
      setPhone("");
      setError("");
      setShowDatePicker(false);
      setShowTimePicker(false);
    }
  }, [visible]);

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS !== "ios") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDate((previousDate) => {
        const updatedDate = new Date(previousDate);
        updatedDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        return updatedDate;
      });
      setError("");
    }
  };

  const onChangeTime = (event, selectedTime) => {
    if (Platform.OS !== "ios") {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      setDate((previousDate) => {
        const updatedDate = new Date(previousDate);
        updatedDate.setHours(
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          0,
          0
        );
        return updatedDate;
      });
      setError("");
    }
  };

  const handleSubmit = () => {
    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      setError("Veuillez saisir votre numéro de téléphone.");
      return;
    }

    const digits = cleanPhone.replace(/\D/g, "");

    if (digits.length < 8 || digits.length > 15) {
      setError("Veuillez saisir un numéro de téléphone valide.");
      return;
    }

    if (date.getTime() <= Date.now()) {
      setError("Veuillez choisir une date et une heure dans le futur.");
      return;
    }

    const dateTimeIso = date.toISOString();

    onSubmit({
      dateTime: dateTimeIso,
      phone: cleanPhone,
    });

    onClose();
  };

  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar
        backgroundColor="rgba(15,23,42,0.65)"
        barStyle="light-content"
      />

      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.modalContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Barre supérieure */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIcon}>
                    <Ionicons
                      name="calendar"
                      size={23}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.headerText}>
                    <Text style={styles.modalTitle}>Réserver une visite</Text>
                    <Text style={styles.subtitle}>
                      Planifiez votre visite en quelques étapes
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={21} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              {/* Bien immobilier */}
              <View style={styles.propertyCard}>
                <View style={styles.propertyIcon}>
                  <Ionicons
                    name="home-outline"
                    size={21}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyLabel}>BIEN À VISITER</Text>
                  <Text style={styles.propertyTitle} numberOfLines={2}>
                    {propertyTitle || "Bien immobilier"}
                  </Text>
                </View>
              </View>

              {/* Informations */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Informations de la visite
                </Text>
                <Text style={styles.required}>* Obligatoire</Text>
              </View>

              {/* Date */}
              <Text style={styles.label}>Date de visite</Text>

              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  setShowTimePicker(false);
                  setShowDatePicker(true);
                }}
                activeOpacity={0.75}
              >
                <View style={styles.fieldIcon}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.pickerInfo}>
                  <Text style={styles.fieldHint}>Choisir une date</Text>
                  <Text style={styles.pickerButtonText}>{formattedDate}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={COLORS.muted}
                />
              </TouchableOpacity>

              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    minimumDate={new Date()}
                    onChange={onChangeDate}
                    themeVariant="light"
                    accentColor="#2563EB"
                    textColor="#0F172A"
                  />

                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Text style={styles.doneButtonText}>Terminer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Heure */}
              <Text style={styles.label}>Heure de visite</Text>

              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  setShowDatePicker(false);
                  setShowTimePicker(true);
                }}
                activeOpacity={0.75}
              >
                <View style={styles.fieldIcon}>
                  <Ionicons
                    name="time-outline"
                    size={21}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.pickerInfo}>
                  <Text style={styles.fieldHint}>Choisir une heure</Text>
                  <Text style={styles.pickerButtonText}>{formattedTime}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={19}
                  color={COLORS.muted}
                />
              </TouchableOpacity>

              {showTimePicker && (
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={date}
                    mode="time"
                    is24Hour
                    display={Platform.OS === "ios" ? "spinner" : "clock"}
                    onChange={onChangeTime}
                    themeVariant="light"
                    accentColor="#2563EB"
                    textColor="#0F172A"
                  />

                  {Platform.OS === "ios" && (
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => setShowTimePicker(false)}
                    >
                      <Text style={styles.doneButtonText}>Terminer</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Téléphone */}
              <Text style={styles.label}>Numéro de téléphone</Text>

              <View style={styles.phoneInputContainer}>
                <View style={styles.fieldIcon}>
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="+221 77 000 00 00"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);
                    setError("");
                  }}
                  maxLength={20}
                />
              </View>

              <Text style={styles.helperText}>
                Ce numéro permettra au propriétaire de vous contacter pour
                confirmer la visite.
              </Text>

              {/* Erreur */}
              {!!error && (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={17}
                    color={COLORS.danger}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Information */}
              <View style={styles.infoCard}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.infoText}>
                  Votre demande sera transmise au propriétaire. La visite sera
                  confirmée après validation.
                </Text>
              </View>

              {/* Bouton */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitButtonText}>
                  Confirmer ma demande
                </Text>
                <Ionicons name="arrow-forward" size={19} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },

  keyboardContainer: {
    width: "100%",
    maxWidth: 430,
    maxHeight: "92%",
    justifyContent: "center",
  },

  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 20,
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: 22,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.title,
  },

  subtitle: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  propertyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 17,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  propertyIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  propertyInfo: {
    flex: 1,
  },

  propertyLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
    color: COLORS.primary,
    marginBottom: 5,
  },

  propertyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.title,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.title,
  },

  required: {
    fontSize: 10,
    color: COLORS.muted,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 9,
    marginTop: 15,
  },

  pickerButton: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 12,
  },

  fieldIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  pickerInfo: {
    flex: 1,
  },

  fieldHint: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 4,
  },

  pickerButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.title,
    textTransform: "capitalize",
  },

  datePickerContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    elevation: 2,
  },

  doneButton: {
    alignSelf: "flex-end",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 8,
  },

  doneButtonText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 13,
  },

  phoneInputContainer: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 10,
  },

  input: {
    flex: 1,
    height: 55,
    fontSize: 14,
    color: COLORS.title,
  },

  helperText: {
    fontSize: 10,
    lineHeight: 16,
    color: COLORS.muted,
    marginTop: 8,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
  },

  errorText: {
    flex: 1,
    color: COLORS.danger,
    fontSize: 11,
    marginLeft: 7,
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F1F7FF",
    padding: 12,
    borderRadius: 13,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  infoText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.text,
    marginLeft: 9,
  },

  submitButton: {
    minHeight: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 9,
    elevation: 5,
  },

  submitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
    marginRight: 10,
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 13,
  },

  cancelButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
});
