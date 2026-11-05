import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../../components/common/Header";

const STORAGE_KEY = "@easyrent_settings";

const DEFAULT_SETTINGS = {
  push: true,
  messages: true,
  visits: true,
  favorites: true,
  system: true,
};

const NOTIFICATION_OPTIONS = [
  {
    key: "messages",
    title: "Messages",
    description: "Nouveaux messages des locataires",
    icon: "chatbubble-ellipses-outline",
    color: "#2563EB",
    background: "#EFF6FF",
  },
  {
    key: "visits",
    title: "Demandes de visite",
    description: "Nouvelles demandes et confirmations",
    icon: "calendar-outline",
    color: "#D97706",
    background: "#FFFBEB",
  },
  {
    key: "favorites",
    title: "Favoris",
    description: "Activités liées à vos annonces favorites",
    icon: "heart-outline",
    color: "#E11D48",
    background: "#FFF1F2",
  },
  {
    key: "system",
    title: "Notifications système",
    description: "Informations et mises à jour Easy Rent",
    icon: "notifications-outline",
    color: "#7C3AED",
    background: "#F5F3FF",
  },
];

export default function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Charger les préférences enregistrées
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored);

          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed,
          });
        }
      } catch (error) {
        console.log("Erreur chargement paramètres :", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Enregistrer les préférences
  const saveSettings = useCallback(async (newSettings) => {
    try {
      setSaving(true);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.log("Erreur sauvegarde paramètres :", error);
      Alert.alert("Erreur", "Impossible d'enregistrer vos préférences.");
    } finally {
      setSaving(false);
    }
  }, []);

  // Modifier une préférence
  const updateSetting = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Activer ou désactiver toutes les notifications
  const toggleAllNotifications = (value) => {
    const newSettings = {
      ...settings,
      push: value,
    };

    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const renderNotificationOption = (item) => (
    <View key={item.key} style={styles.optionRow}>
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, { backgroundColor: item.background }]}>
          <Ionicons name={item.icon} size={21} color={item.color} />
        </View>

        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{item.title}</Text>

          <Text style={styles.optionDescription}>{item.description}</Text>
        </View>
      </View>

      <Switch
        value={settings[item.key]}
        onValueChange={(value) => updateSetting(item.key, value)}
        disabled={!settings.push || loading}
        trackColor={{
          false: "#CBD5E1",
          true: "#93C5FD",
        }}
        thumbColor={settings[item.key] && settings.push ? "#2563EB" : "#F8FAFC"}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Chargement des paramètres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Paramètres" showBack />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.intro}>
          <Text style={styles.heading}>Gérez vos préférences</Text>

          <Text style={styles.introDescription}>
            Personnalisez votre expérience Easy Rent selon vos besoins.
          </Text>
        </View>

        {/* Notifications générales */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.mainIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <Text style={styles.sectionSubtitle}>Gérez vos alertes</Text>
              </View>
            </View>
          </View>

          <View style={styles.masterRow}>
            <View style={styles.masterText}>
              <Text style={styles.masterTitle}>Tout activer</Text>

              <Text style={styles.masterDescription}>
                Recevoir les notifications Easy Rent
              </Text>
            </View>

            <Switch
              value={settings.push}
              onValueChange={toggleAllNotifications}
              trackColor={{
                false: "#CBD5E1",
                true: "#93C5FD",
              }}
              thumbColor={settings.push ? "#2563EB" : "#F8FAFC"}
            />
          </View>

          <View style={styles.separator} />

          <Text style={styles.subsectionTitle}>
            PERSONNALISER LES NOTIFICATIONS
          </Text>

          {NOTIFICATION_OPTIONS.map(renderNotificationOption)}

          {!settings.push && (
            <View style={styles.disabledNotice}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#64748B"
              />

              <Text style={styles.disabledText}>
                Activez les notifications générales pour modifier ces
                préférences.
              </Text>
            </View>
          )}
        </View>

        {/* Informations de sécurité */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#059669"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Votre compte est important</Text>

            <Text style={styles.infoDescription}>
              Ne partagez jamais votre mot de passe et veillez à utiliser un mot
              de passe sécurisé.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons name="checkmark-circle" size={16} color="#16A34A" />

          <Text style={styles.footerText}>
            Vos préférences sont enregistrées automatiquement
          </Text>
        </View>

        {saving && (
          <View style={styles.savingRow}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.savingText}>Enregistrement...</Text>
          </View>
        )}

        <Text style={styles.version}>Easy Rent · Paramètres</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingBottom: 45,
    paddingTop: 20,
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 14,
  },

  intro: {
    marginBottom: 22,
  },

  heading: {
    fontSize: 23,
    fontWeight: "800",
    color: "#0F172A",
  },

  introDescription: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 7,
    lineHeight: 21,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  mainIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },

  masterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },

  masterText: {
    flex: 1,
    paddingRight: 12,
  },

  masterTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  masterDescription: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  separator: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 17,
  },

  subsectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 8,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },

  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  optionText: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },

  optionDescription: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
    lineHeight: 16,
  },

  disabledNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
  },

  disabledText: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    marginLeft: 8,
    lineHeight: 18,
  },

  infoCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
  },

  infoDescription: {
    fontSize: 12,
    color: "#047857",
    lineHeight: 18,
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  footerText: {
    fontSize: 11,
    color: "#64748B",
    marginLeft: 7,
  },

  savingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  savingText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 7,
  },

  version: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 22,
  },
});
