import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const STORAGE_KEY = "@easyrent_settings";

const DEFAULT_SETTINGS = {
  push: true,
  messages: true,
  visits: true,
  favorites: true,
  system: true,
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Charger les préférences enregistrées
  useEffect(() => {
    async function loadSettings() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...JSON.parse(saved),
          });
        }
      } catch (error) {
        console.log("Erreur chargement paramètres :", error);
      } finally {
        setLoaded(true);
      }
    }

    loadSettings();
  }, []);

  // Sauvegarder les préférences
  useEffect(() => {
    if (!loaded) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(
      (error) => {
        console.log("Erreur sauvegarde paramètres :", error);
      },
    );
  }, [settings, loaded]);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateAllNotifications = (value) => {
    setSettings({
      push: value,
      messages: value,
      visits: value,
      favorites: value,
      system: value,
    });
  };

  const SettingItem = ({
    icon,
    title,
    description,
    value,
    onValueChange,
    color = "#2563EB",
    backgroundColor = "#EFF6FF",
    disabled = false,
  }) => (
    <View style={styles.settingItem}>
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Ionicons name={icon} size={21} color={color} />
      </View>

      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: "#E2E8F0",
          true: "#93C5FD",
        }}
        thumbColor={value ? "#2563EB" : "#F8FAFC"}
        ios_backgroundColor="#E2E8F0"
      />
    </View>
  );

  if (!loaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={23} color="#1E293B" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Paramètres</Text>
            <Text style={styles.headerSubtitle}>
              Personnalisez votre expérience Easy Rent
            </Text>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <Text style={styles.sectionCaption}>Gérez vos alertes</Text>
          </View>

          <View style={styles.card}>
            <SettingItem
              icon="notifications-outline"
              title="Notifications push"
              description="Activer ou désactiver toutes les alertes"
              value={settings.push}
              onValueChange={updateAllNotifications}
              color="#7C3AED"
              backgroundColor="#F3E8FF"
            />

            <View style={styles.separator} />

            <SettingItem
              icon="chatbubble-ellipses-outline"
              title="Messages"
              description="Recevoir les alertes de nouveaux messages"
              value={settings.messages}
              onValueChange={(value) => updateSetting("messages", value)}
              disabled={!settings.push}
              color="#2563EB"
              backgroundColor="#EFF6FF"
            />

            <View style={styles.separator} />

            <SettingItem
              icon="calendar-outline"
              title="Demandes de visite"
              description="Suivre les confirmations et changements"
              value={settings.visits}
              onValueChange={(value) => updateSetting("visits", value)}
              disabled={!settings.push}
              color="#0D9488"
              backgroundColor="#E6F7F5"
            />

            <View style={styles.separator} />

            <SettingItem
              icon="heart-outline"
              title="Favoris et annonces"
              description="Recevoir les alertes concernant vos favoris"
              value={settings.favorites}
              onValueChange={(value) => updateSetting("favorites", value)}
              disabled={!settings.push}
              color="#E11D48"
              backgroundColor="#FFF1F2"
            />

            <View style={styles.separator} />

            <SettingItem
              icon="information-circle-outline"
              title="Notifications système"
              description="Informations et actualités Easy Rent"
              value={settings.system}
              onValueChange={(value) => updateSetting("system", value)}
              disabled={!settings.push}
              color="#D97706"
              backgroundColor="#FFF7E6"
            />
          </View>
        </View>


        {/* À propos */}
        <View style={styles.about}>
          <Ionicons name="home-outline" size={22} color="#2563EB" />
          <Text style={styles.aboutName}>Easy Rent</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.aboutDescription}>
            Votre logement, en toute simplicité.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingTop: 30,
  },

  content: {
    paddingBottom: 40,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 30,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    elevation: 2,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#1E293B",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 27,
  },

  sectionHeader: {
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 5,
  },

  sectionCaption: {
    fontSize: 12,
    color: "#94A3B8",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    elevation: 2,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    gap: 11,
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  settingInfo: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
  },

  settingDescription: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    lineHeight: 15,
  },

  separator: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 54,
  },

  cardLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    gap: 12,
    elevation: 2,
  },

  about: {
    alignItems: "center",
    marginTop: 5,
    paddingVertical: 20,
  },

  aboutName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E293B",
    marginTop: 8,
  },

  version: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  aboutDescription: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 7,
  },
});
