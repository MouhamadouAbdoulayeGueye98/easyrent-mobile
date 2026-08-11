import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Header from "../../../components/common/Header";
import ProfileMenuItem from "../../../components/publisher/ProfileMenuItem";

export default function PublisherProfile() {

    function handleLogout() {
      Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
        {
          text: "Annuler",
          style: "cancel",
        },

        {
          text: "Déconnexion",
          style: "destructive",

          onPress: () => {
            // Plus tard :
            // suppression token
            // Firebase signOut()
            // appel API NestJS

            router.replace("/login");
          },
        },
      ]);
    }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Mon profil" />

      {/* Carte profil */}

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={50} color="#2563EB" />
        </View>

        <Text style={styles.name}>Abdoulaye Gueye</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>Particulier</Text>
        </View>

        <Text style={styles.member}>Membre depuis Juillet 2026</Text>
      </View>

      <Text style={styles.sectionTitle}>Informations personnelles</Text>

      <ProfileMenuItem
        icon="person-outline"
        color="#2563EB"
        title="Nom complet"
        subtitle="Abdoulaye Gueye"
      />

      <ProfileMenuItem
        icon="call-outline"
        color="#10B981"
        title="Téléphone"
        subtitle="+221 77 123 45 67"
      />

      <ProfileMenuItem
        icon="mail-outline"
        color="#F59E0B"
        title="Adresse email"
        subtitle="abdoulaye@email.com"
      />

      <ProfileMenuItem
        icon="location-outline"
        color="#8B5CF6"
        title="Ville"
        subtitle="Dakar"
      />

      <Text style={styles.sectionTitle}>Compte annonceur</Text>

      <ProfileMenuItem
        icon="business-outline"
        color="#2563EB"
        title="Type d'annonceur"
        subtitle="Particulier"
      />

      <ProfileMenuItem
        icon="shield-checkmark-outline"
        color="#10B981"
        title="Compte vérifié"
        subtitle="Non vérifié"
      />

      <Text style={styles.sectionTitle}>Paramètres</Text>

      <ProfileMenuItem
        icon="notifications-outline"
        color="#F59E0B"
        title="Notifications"
      />

      <ProfileMenuItem
        icon="lock-closed-outline"
        color="#8B5CF6"
        title="Sécurité"
      />

      <ProfileMenuItem
        icon="help-circle-outline"
        color="#06B6D4"
        title="Centre d'aide"
      />

      <ProfileMenuItem
        icon="settings-outline"
        color="#2563EB"
        title="Paramètres"
        onPress={() => router.push("/publisher/profile/settings")}
      />

      <ProfileMenuItem
        icon="log-out-outline"
        color="#EF4444"
        title="Déconnexion"
        onPress={handleLogout}
      />
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

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    marginBottom: 30,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  badge: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  member: {
    marginTop: 12,
    color: "#6B7280",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 15,
    marginTop: 10,
  },
});