import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import GuestScreen from "../../components/common/GuestScreen";
import { getConversations } from "../../services/conversations";
import ConversationCard from "../../components/messages/ConversationCard";

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let isActive = true;

      async function load() {
        try {
          const data = await getConversations();
          if (isActive) setConversations(data);
        } catch (error) {
          console.error("Erreur chargement conversations :", error);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      load();
      const interval = setInterval(load, 8000); // polling simple

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [user])
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Messages" />
        <GuestScreen
          icon="chatbubble-outline"
          title="Discutez avec les annonceurs"
          description="Connectez-vous pour contacter les propriétaires et retrouver vos conversations."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Messages" />

      {loading ? (
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
      ) : conversations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucune conversation pour l'instant.</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationCard conversation={item} currentUserId={user.id} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", paddingTop: 40 },
  list: { padding: 20, paddingBottom: 40 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyText: { color: "#6B7280", fontSize: 15, textAlign: "center" },
});