
import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import StatCard from "../../components/publisher/StatCard";
import QuickAction from "../../components/publisher/QuickAction";
import ActivityCard from "../../components/publisher/ActivityCard";

import { getConversations } from "../../services/conversations";
import { getMyProperties } from "../../services/propertyService";
import { getVisits } from "../../services/visits";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  background: "#F4F7FC",
  surface: "#FFFFFF",
  text: "#172033",
  muted: "#758198",
  border: "#E2E8F0",
  blueSoft: "#EAF1FF",
  green: "#15966A",
  greenSoft: "#E8F7F0",
  purple: "#7956D8",
  purpleSoft: "#F0EBFF",
};

export default function PublisherDashboard() {
  const [messagesCount, setMessagesCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);

  const [recentVisits, setRecentVisits] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [conversations, visits, properties] = await Promise.all([
        getConversations(),
        getVisits(),
        getMyProperties(),
      ]);

      const safeConversations = Array.isArray(conversations)
        ? conversations
        : [];

      const safeVisits = Array.isArray(visits) ? visits : [];

      const safeProperties = Array.isArray(properties) ? properties : [];

      setMessagesCount(safeConversations.length);
      setRequestsCount(safeVisits.length);
      setPropertiesCount(safeProperties.length);

      setRecentVisits(safeVisits.slice(0, 3));
      setRecentMessages(safeConversations.slice(0, 3));
    } catch (error) {
      console.error(
        "Erreur chargement dashboard annonceur :",
        error.response?.data || error,
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function loadDashboard() {
        try {
          setLoading(true);

          const [conversations, visits, properties] = await Promise.all([
            getConversations(),
            getVisits(),
            getMyProperties(),
          ]);

          if (!isActive) return;

          const safeConversations = Array.isArray(conversations)
            ? conversations
            : [];

          const safeVisits = Array.isArray(visits) ? visits : [];

          const safeProperties = Array.isArray(properties) ? properties : [];

          setMessagesCount(safeConversations.length);
          setRequestsCount(safeVisits.length);
          setPropertiesCount(safeProperties.length);

          setRecentVisits(safeVisits.slice(0, 3));
          setRecentMessages(safeConversations.slice(0, 3));
        } catch (error) {
          console.error(
            "Erreur chargement dashboard annonceur :",
            error.response?.data || error,
          );
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      loadDashboard();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchStats(true)}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>ESPACE ANNONCEUR</Text>
            </View>

            <Text style={styles.title}>Tableau de bord</Text>

            <Text style={styles.subtitle}>
              Retrouvez ici l’essentiel de votre activité immobilière.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Consulter les demandes"
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Bandeau de bienvenue */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeLabel}>BIENVENUE</Text>
            <Text style={styles.welcomeTitle}>
              Gérez vos logements{"\n"}en toute simplicité.
            </Text>
            <Text style={styles.welcomeDescription}>
              Publiez et suivez vos annonces depuis un seul espace.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/publisher-create")}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Ajouter un logement</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.welcomeIcon}>
            <Ionicons name="business-outline" size={45} color="#FFFFFF" />
          </View>

          <View style={styles.decorativeCircle} />
        </View>

        {/* Statistiques réelles */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionText}>
            <Text style={styles.sectionTitle}>Votre activité</Text>
            <Text style={styles.sectionSubtitle}>
              Données issues de votre compte
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => fetchStats(true)}
            disabled={refreshing || loading}
            activeOpacity={0.7}
            accessibilityLabel="Actualiser les statistiques"
          >
            <Ionicons name="refresh-outline" size={19} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Annonces"
            value={loading ? "—" : propertiesCount.toString()}
            icon="home"
            color={COLORS.primary}
            onPress={() => router.push("/publisher/listings")}
          />

          <StatCard
            title="Demandes"
            value={loading ? "—" : requestsCount.toString()}
            icon="calendar"
            color={COLORS.green}
            onPress={() => router.push("/publisher/requests")}
          />

          <StatCard
            title="Conversations"
            value={loading ? "—" : messagesCount.toString()}
            icon="chatbubble"
            color={COLORS.purple}
            onPress={() => router.push("/publisher/messages")}
          />
        </View>

        {/* Actions rapides */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionText}>
            <Text style={styles.sectionTitle}>Accès rapides</Text>
            <Text style={styles.sectionSubtitle}>
              Les fonctionnalités essentielles
            </Text>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          <QuickAction
            title="Mes annonces"
            icon="home"
            color={COLORS.primary}
            onPress={() => router.push("/publisher/listings")}
          />

          <QuickAction
            title="Demandes de visite"
            icon="calendar"
            color={COLORS.green}
            onPress={() => router.push("/publisher/requests")}
          />

          <QuickAction
            title="Mes messages"
            icon="chatbubble"
            color={COLORS.purple}
            onPress={() => router.push("/publisher/messages")}
          />

          <QuickAction
            title="Mon profil"
            icon="person"
            color="#D97706"
            onPress={() => router.push("/publisher/profile")}
          />
        </View>

        {/* Activité récente */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionText}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <Text style={styles.sectionSubtitle}>
              Vos dernières interactions
            </Text>
          </View>
        </View>

        <View style={styles.activitySection}>
          {loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="sync-outline" size={26} color={COLORS.muted} />
              <Text style={styles.emptyTitle}>
                Chargement de votre activité…
              </Text>
            </View>
          ) : recentVisits.length === 0 && recentMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="file-tray-outline"
                  size={30}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>Aucune activité récente</Text>
              <Text style={styles.emptyDescription}>
                Vos nouvelles demandes de visite et conversations apparaîtront
                ici.
              </Text>
            </View>
          ) : (
            <>
              {recentVisits.map((visit, index) => (
                <ActivityCard
                  key={`visit-${visit.id || index}`}
                  icon="calendar"
                  color={COLORS.green}
                  title="Demande de visite"
                  subtitle={
                    visit.property?.title ||
                    visit.propertyTitle ||
                    "Logement concerné"
                  }
                  onPress={() => router.push("/publisher/requests")}
                />
              ))}

              {recentMessages.map((msg, index) => (
                <ActivityCard
                  key={`message-${msg.id || index}`}
                  icon="chatbubble"
                  color={COLORS.purple}
                  title="Conversation"
                  subtitle={
                    msg.lastMessage ||
                    msg.content ||
                    msg.lastMessageContent ||
                    "Ouvrir la conversation"
                  }
                  onPress={() => router.push("/publisher/messages")}
                />
              ))}
            </>
          )}
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Image
              source={require("../../assets/images/easyrent-icon-1024.png")}
              style={styles.footerLogoImage}
              resizeMode="contain"
            />
            <Text style={styles.footerBrand}>Easy Rent</Text>
          </View>

          <Text style={styles.footerText}>
            Votre espace immobilier, simplement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
    paddingBottom: 26,
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  headerText: {
    flex: 1,
    paddingRight: 14,
  },

  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  eyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.green,
    marginRight: 7,
  },

  eyebrowText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: COLORS.primary,
  },

  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.7,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  welcomeCard: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 30,
    minHeight: 220,
  },

  welcomeContent: {
    zIndex: 2,
    alignItems: "flex-start",
    paddingRight: 20,
  },

  welcomeLabel: {
    color: "#D9E7FF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    marginBottom: 10,
  },

  welcomeTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "800",
  },

  welcomeDescription: {
    color: "#E0EAFE",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 235,
  },

  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginTop: 17,
    gap: 6,
  },

  primaryButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  welcomeIcon: {
    position: "absolute",
    top: 20,
    right: 18,
    width: 66,
    height: 66,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  decorativeCircle: {
    position: "absolute",
    width: 155,
    height: 155,
    borderRadius: 78,
    right: -65,
    bottom: -75,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 2,
  },

  sectionText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.4,
  },

  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    color: COLORS.muted,
  },

  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  statCard: {
    width: "48%",
  },

  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 28,
  },

  activitySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 16,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 8,
  },

  emptyDescription: {
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 6,
  },

  footer: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 18,
  },

  footerLogo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  footerBrand: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },

  footerText: {
    marginTop: 5,
    fontSize: 11,
    color: COLORS.muted,
  },
  footerLogoImage: {
  width: 24,
  height: 24,
},
});
