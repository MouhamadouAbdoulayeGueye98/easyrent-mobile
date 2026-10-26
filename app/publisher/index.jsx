
import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
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
  primary: "#2563EB",
  background: "#F5F7FB",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#E8EDF5",
  blueSoft: "#EAF1FF",
};

export default function PublisherDashboard() {
  const [messagesCount, setMessagesCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [recentVisits, setRecentVisits] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchStats() {
        try {
          const [conversations, visits, properties] = await Promise.all([
            getConversations().catch(() => []),
            getVisits().catch(() => []),
            getMyProperties().catch(() => []),
          ]);

          if (isActive) {
            setMessagesCount(conversations.length);
            setRequestsCount(visits.length);
            setPropertiesCount(properties.length);
            setRecentVisits(visits.slice(0, 2));
            setRecentMessages(conversations.slice(0, 2));
          }
        } catch (error) {
          console.error("Erreur chargement stats dashboard :", error);
        }
      }

      fetchStats();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            {/* <Text style={styles.greeting}>BONJOUR </Text> */}
            <Text style={styles.name}>Votre espace annonceur</Text>
            <Text style={styles.headerSubtitle}>
              Gérez vos logements et suivez votre activité en un coup d’œil.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerBadge}
            onPress={() => router.push("/publisher/requests")}
            activeOpacity={0.75}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={25} color="#FFFFFF" />

            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Statistiques */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Vue d’ensemble</Text>
            <Text style={styles.sectionSubtitle}>
              Les chiffres de votre activité
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Annonces"
            value={propertiesCount.toString()}
            icon="home"
            color="#2563EB"
            onPress={() => router.push("/publisher/listings")}
          />

          <StatCard
            title="Demandes"
            value={requestsCount.toString()}
            icon="calendar"
            color="#10B981"
            onPress={() => router.push("/publisher/requests")}
          />

          <StatCard
            title="Messages"
            value={messagesCount.toString()}
            icon="chatbubble"
            color="#8B5CF6"
            onPress={() => router.push("/publisher/messages")}
          />

          <StatCard title="Vues" value="245" icon="eye" color="#F59E0B" />
        </View>

        {/* Actions rapides */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <Text style={styles.sectionSubtitle}>
              Accédez directement aux fonctionnalités
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <QuickAction
            title="Ajouter un logement"
            icon="add-circle"
            color="#2563EB"
            onPress={() => router.push("/publisher-create")}
          />

          <QuickAction
            title="Mes annonces"
            icon="home"
            color="#10B981"
            onPress={() => router.push("/publisher/listings")}
          />

          <QuickAction
            title="Messages"
            icon="chatbubble"
            color="#8B5CF6"
            onPress={() => router.push("/publisher/messages")}
          />

          <QuickAction
            title="Profil"
            icon="person"
            color="#F59E0B"
            onPress={() => router.push("/publisher/profile")}
          />
        </View>

        {/* Activité récente */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <Text style={styles.sectionSubtitle}>
              Les dernières interactions sur vos annonces
            </Text>
          </View>
        </View>

        <View style={styles.activitySection}>
          {recentVisits.length > 0 ? (
            recentVisits.map((visit, index) => (
              <ActivityCard
                key={visit.id || index}
                icon="calendar"
                color="#10B981"
                title="Nouvelle demande de visite"
                subtitle={
                  visit.property?.title ||
                  visit.propertyTitle ||
                  "Logement concerné"
                }
                onPress={() => router.push("/publisher/requests")}
              />
            ))
          ) : (
            <ActivityCard
              icon="calendar-outline"
              color="#9CA3AF"
              title="Aucune demande récente"
              subtitle="Vos futures demandes de visites apparaîtront ici."
            />
          )}

          {recentMessages.length > 0 ? (
            recentMessages.map((msg, index) => (
              <ActivityCard
                key={msg.id || index}
                icon="chatbubble"
                color="#8B5CF6"
                title="Nouveau message"
                subtitle={
                  msg.lastMessage || msg.content || "Un client vous a contacté."
                }
                onPress={() => router.push("/publisher/messages")}
              />
            ))
          ) : (
            <ActivityCard
              icon="chatbubble-outline"
              color="#9CA3AF"
              title="Aucun message récent"
              subtitle="Vos discussions s'afficheront ici."
            />
          )}

          <ActivityCard
            icon="home"
            color="#2563EB"
            title="Annonce publiée"
            subtitle="Studio à Ouakam"
            onPress={() => router.push("/publisher/listings")}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Easy Rent · Votre espace immobilier
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
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 36,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingTop: 8,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  greeting: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: COLORS.primary,
    marginBottom: 9,
  },

  name: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "800",
    color: COLORS.text,
  },

  headerSubtitle: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.muted,
  },

  headerBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },

  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  sectionHeader: {
    marginTop: 6,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.4,
  },

  sectionSubtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.muted,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 27,
  },

  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 27,
  },

  activitySection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  footer: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 5,
  },

  footerText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "500",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F97316",
    borderWidth: 1.5,
    borderColor: "#2563EB",
  },
});
