import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../services/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    usersCount: 0,
    propertiesCount: 0,
    visitsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Tentative d'appel vers le backend
      // const response = await api.get("/admin/stats");
      // setStats(response.data);
      
      // En attendant que les routes admin soient créées sur le backend NestJS :
      setStats({
        usersCount: 24,
        propertiesCount: 12,
        visitsCount: 45,
      });
    } catch (error) {
      console.log("Session admin ou route non disponible, affichage par défaut");
      // On garde des valeurs par défaut pour ne pas bloquer l'interface
      setStats({
        usersCount: 0,
        propertiesCount: 0,
        visitsCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    // Redirection vers la page de connexion
    router.replace("/auth/login");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0066FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Espace Administrateur</Text>
          <Text style={styles.subWelcomeText}>Supervision globale Easy-Rent</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cartes de statistiques */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={28} color="#0066FF" />
            <Text style={styles.statNumber}>{stats.usersCount}</Text>
            <Text style={styles.statLabel}>Utilisateurs</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="home-outline" size={28} color="#34C759" />
            <Text style={styles.statNumber}>{stats.propertiesCount}</Text>
            <Text style={styles.statLabel}>Propriétés</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={28} color="#FF9500" />
            <Text style={styles.statNumber}>{stats.visitsCount}</Text>
            <Text style={styles.statLabel}>Visites totales</Text>
          </View>
        </View>

        {/* Section Actions de gestion */}
        <Text style={styles.sectionTitle}>Gestion de la plateforme</Text>

        <TouchableOpacity style={styles.actionRow}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#0066FF" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Valider les annonces</Text>
            <Text style={styles.actionSubtitle}>Modérer les nouvelles publications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="people-circle-outline" size={22} color="#34C759" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Gérer les utilisateurs</Text>
            <Text style={styles.actionSubtitle}>Voir la liste des clients et annonceurs</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  subWelcomeText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FFF2F2",
  },
  scrollContent: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 15,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  actionSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
});