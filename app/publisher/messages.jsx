
import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import ConversationCard from "../../components/messages/ConversationCard";
import { useAuth } from "../../context/AuthContext";
import { getConversations } from "../../services/conversations";

const COLORS = {
  primary: "#1749A6",
  background: "#F4F7FC",
  surface: "#FFFFFF",
  text: "#172033",
  muted: "#758198",
  border: "#E2E8F0",
  blueSoft: "#EAF1FF",
};

export default function Messages() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let isFirstLoad = true;

      const load = async () => {
        try {
          const data = await getConversations();

          if (isActive) {
            setConversations(Array.isArray(data) ? data : []);
            setError(false);
          }
        } catch (err) {
          console.error("Erreur chargement conversations :", err);

          if (isActive) {
            setError(true);
          }
        } finally {
          if (isActive) {
            setLoading(false);
            setRefreshing(false);
          }
          isFirstLoad = false;
        }
      };

      load();

      const interval = setInterval(load, 8000);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      const data = await getConversations();
      setConversations(Array.isArray(data) ? data : []);
      setError(false);
    } catch (err) {
      console.error("Erreur actualisation conversations :", err);
      setError(true);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderIntro = () => (
    <View style={styles.intro}>
      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <Text style={styles.pageTitle}>Messages</Text>
          <Text style={styles.subtitle}>
            Retrouvez les échanges avec les personnes intéressées
            par vos biens immobiliers.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="chatbubbles-outline"
            size={27}
            color={COLORS.primary}
          />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="mail-unread-outline"
            size={25}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>
            Vos conversations
          </Text>
          <Text style={styles.summaryValue}>
            {conversations.length}
          </Text>
        </View>

        <View style={styles.summaryBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.summaryBadgeText}>
            Actualisation active
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Toutes les conversations
          </Text>
          <Text style={styles.sectionSubtitle}>
            {conversations.length === 1
              ? "1 conversation"
              : `${conversations.length} conversations`}
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {conversations.length}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Ionicons
            name="alert-circle-outline"
            size={19}
            color="#B91C1C"
          />
          <Text style={styles.errorBannerText}>
            Impossible d'actualiser les conversations. Réessayez en
            faisant glisser la liste vers le bas.
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.loadingIcon}>
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Chargement des messages
          </Text>

          <Text style={styles.emptyText}>
            Nous récupérons vos conversations...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="chatbubbles-outline"
            size={38}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.emptyTitle}>
          Aucune conversation pour le moment
        </Text>

        <Text style={styles.emptyText}>
          Lorsqu'un client vous contactera au sujet d'un bien,
          votre conversation apparaîtra ici.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <FlatList
        data={conversations}
        keyExtractor={(item, index) =>
          item.id?.toString() || `conversation-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.conversationWrapper}>
            <ConversationCard
              conversation={item}
              currentUserId={user?.id}
            />
          </View>
        )}
        ListHeaderComponent={renderIntro}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },

  list: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 36,
    flexGrow: 1,
  },

  intro: {
    marginBottom: 8,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },

  titleContent: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.6,
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
  },

  headerIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
    gap: 12,
  },

  summaryIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryContent: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 5,
  },

  summaryValue: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
  },

  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E8F7F0",
    paddingHorizontal: 9,
    paddingVertical: 8,
    borderRadius: 12,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#15966A",
  },

  summaryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#15966A",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 5,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
  },

  countBadge: {
    minWidth: 35,
    height: 35,
    paddingHorizontal: 9,
    borderRadius: 12,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
  },

  conversationWrapper: {
    marginBottom: 14,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 280,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  loadingIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 9,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 21,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 290,
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 12,
    borderRadius: 13,
    backgroundColor: "#FEF2F2",
    marginBottom: 16,
  },

  errorBannerText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 12,
    lineHeight: 18,
  },
});
