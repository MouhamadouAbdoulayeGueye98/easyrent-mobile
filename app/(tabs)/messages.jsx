import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { FlatList } from "react-native";

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import GuestScreen from "../../components/common/GuestScreen";
import ConversationCard from "../../components/messages/ConversationCard";

import { useGetConversationsQuery } from "../../services/api";

export default function Messages() {
  const { user } = useAuth();

  // Utilisation de RTK Query avec un polling toutes les 8 secondes si l'utilisateur est connecté
  const { 
    data: conversations = [], 
    isLoading: loading, 
    error 
  } = useGetConversationsQuery(undefined, {
    skip: !user, // Ne fait la requête que si l'utilisateur est connecté
    pollingInterval: 8000,
  });

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

  if (error) {
    console.error("Erreur chargement conversations :", error);
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