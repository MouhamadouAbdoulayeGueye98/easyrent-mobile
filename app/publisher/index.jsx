import { useState, useCallback } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";

import StatCard from "../../components/publisher/StatCard";
import QuickAction from "../../components/publisher/QuickAction";
import ActivityCard from "../../components/publisher/ActivityCard";
import { getConversations } from "../../services/conversations";

export default function PublisherDashboard() {
  const [messagesCount, setMessagesCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchStats() {
        try {
          const conversations = await getConversations();
          if (isActive) {
            setMessagesCount(conversations.length);
          }
        } catch (error) {
          console.error("Erreur chargement stats messages :", error);
        }
      }

      fetchStats();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>Bonjour 👋</Text>

      <Text style={styles.name}>Bienvenue sur votre espace annonceur</Text>

      <Text style={styles.sectionTitle}>Vos statistiques</Text>

      <View style={styles.statsContainer}>
        <StatCard title="Annonces" value="12" icon="home" color="#2563EB" />

        <StatCard title="Demandes" value="18" icon="calendar" color="#10B981" />

        <StatCard
          title="Messages"
          value={messagesCount.toString()}
          icon="chatbubble"
          color="#8B5CF6"
        />

        <StatCard title="Vues" value="245" icon="eye" color="#F59E0B" />
      </View>

      <Text style={styles.sectionTitle}>Actions rapides</Text>

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

      <Text style={styles.sectionTitle}>Activité récente</Text>

      <ActivityCard
        icon="calendar"
        color="#10B981"
        title="Nouvelle demande de visite"
        subtitle="Appartement - Almadies"
      />

      <ActivityCard
        icon="chatbubble"
        color="#8B5CF6"
        title="Nouveau message"
        subtitle="Un client vous a contacté."
      />

      <ActivityCard
        icon="home"
        color="#2563EB"
        title="Annonce publiée"
        subtitle="Studio à Ouakam"
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

  greeting: {
    marginTop: 20,
    fontSize: 18,
    color: "#6B7280",
  },

  name: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  sectionTitle: {
    marginTop: 30,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});