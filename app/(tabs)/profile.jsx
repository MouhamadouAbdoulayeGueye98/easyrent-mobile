
import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import GuestScreen from "../../components/common/GuestScreen";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";

export default function Profile() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
  }

  if (!user) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.guestContent}
        showsVerticalScrollIndicator={false}
      >
        <GuestScreen
          icon="person-circle-outline"
          title="Bienvenue sur EasyRent"
          description="Connectez-vous pour retrouver vos favoris, réserver des visites, discuter avec les annonceurs et publier vos logements."
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        <ProfileHeader />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon activité</Text>

          <View style={styles.menuGroup}>
            <ProfileMenuItem
              icon="heart-outline"
              title="Mes favoris"
              color="#EF476F"
              backgroundColor="#FFF0F3"
              onPress={() => router.push("/favorites")}
            />

            <ProfileMenuItem
              icon="calendar-outline"
              title="Mes visites"
              color="#0D9488"
              backgroundColor="#E6F7F5"
              onPress={() => router.push("/requests")}
            />

            <ProfileMenuItem
              icon="chatbubble-ellipses-outline"
              title="Mes messages"
              color="#2563EB"
              backgroundColor="#EFF6FF"
              onPress={() => router.push("/messages")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>

          <View style={styles.menuGroup}>
            <ProfileMenuItem
              icon="settings-outline"
              title="Paramètres"
              color="#7C3AED"
              backgroundColor="#F3EFFF"
              onPress={() => router.push("/settings")}
            />

            <ProfileMenuItem
              icon="notifications-outline"
              title="Mes notifications"
              color="#D97706"
              backgroundColor="#FFF7E6"
              onPress={() => router.push("/notifications")}
            />

            <ProfileMenuItem
              icon="help-circle-outline"
              title="Aide et assistance"
              color="#0891B2"
              backgroundColor="#E6F7FC"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>

          <View style={styles.menuGroup}>
            <ProfileMenuItem
              icon="log-out-outline"
              title="Déconnexion"
              color="#EF4444"
              backgroundColor="#FEF2F2"
              danger
              onPress={handleLogout}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Ionicons
            name="home-outline"
            size={14}
            color="#94A3B8"
          />
          <Text style={styles.footerText}>
            Easy Rent · Votre logement, en toute simplicité
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
    paddingBottom: 35,
  },

  guestContent: {
    flexGrow: 1,
  },

  section: {
    marginTop: 26,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 13,
    marginLeft: 3,
  },

  menuGroup: {
    gap: 11,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    gap: 6,
  },

  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },
});
