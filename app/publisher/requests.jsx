
import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import RequestCard from "../../components/publisher/RequestCard";
import {
  getVisits,
  acceptVisit,
  refuseVisit,
} from "../../services/visits";
import { useToast } from "../../context/ToastContext";

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
};

export default function PublisherRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const { showToast } = useToast();

  const fetchRequests = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await getVisits();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Erreur chargement demandes annonceur :",
          error
        );

        showToast(
          "Impossible de charger les demandes de visite.",
          "error"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showToast]
  );

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests])
  );

  const handleAccept = async (id) => {
    if (processingId !== null) return;

    setProcessingId(id);

    try {
      await acceptVisit(id);

      showToast(
        "La demande de visite a été acceptée.",
        "success"
      );

      await fetchRequests();
    } catch (error) {
      console.error(
        "Détail erreur acceptation :",
        error.response?.data || error.message
      );

      showToast(
        "Impossible d'accepter cette demande.",
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (processingId !== null) return;

    setProcessingId(id);

    try {
      await refuseVisit(id);

      showToast(
        "La demande de visite a été refusée.",
        "success"
      );

      await fetchRequests();
    } catch (error) {
      console.error(
        "Détail erreur refus :",
        error.response?.data || error.message
      );

      showToast(
        "Impossible de refuser cette demande.",
        "error"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/publisher");
    }
  };

  const getRequestStatus = (request) => {
    const status = String(request.status ?? request.statut ?? "").toLowerCase();

    if (
      ["accepted", "acceptee", "acceptée", "accepte", "approved"].includes(
        status,
      )
    ) {
      return "accepted";
    }

    if (
      ["refused", "rejected", "refusee", "refusée", "refuse"].includes(status)
    ) {
      return "refused";
    }

    if (["pending", "en_attente", "en attente", "waiting"].includes(status)) {
      return "pending";
    }

    return "pending";
  };

  const filteredRequests = requests.filter((request) => {
    if (activeFilter === "all") return true;
    return getRequestStatus(request) === activeFilter;
  });

  const filterOptions = [
    { label: "Toutes", value: "all" },
    { label: "En attente", value: "pending" },
    { label: "Acceptées", value: "accepted" },
    { label: "Refusées", value: "refused" },
  ];
  const renderHeader = () => (
    <View style={styles.intro}>
      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <Text style={styles.pageTitle}>Demandes de visites</Text>

          <Text style={styles.subtitle}>
            Gérez les demandes des personnes intéressées par vos biens
            immobiliers.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="calendar-outline" size={27} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.filterContainer}>
          {filterOptions.map((option) => {
            const selected = activeFilter === option.value;

            return (
              <Text
                key={option.value}
                onPress={() => setActiveFilter(option.value)}
                style={[
                  styles.filterButton,
                  selected && styles.filterButtonActive,
                  selected && styles.filterTextActive,
                ]}
              >
                {option.label}
              </Text>
            );
          })}
        </View>

        <View style={styles.summaryText}>
          <Text style={styles.summaryLabel}>Total des demandes</Text>

          <Text style={styles.summaryValue}>{requests.length}</Text>
        </View>

        <View style={styles.summaryBadge}>
          <Ionicons
            name="checkmark-circle-outline"
            size={15}
            color={COLORS.green}
          />
          <Text style={styles.summaryBadgeText}>Suivi des visites</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Toutes les demandes</Text>
          <Text style={styles.sectionSubtitle}>
            Consultez et traitez vos demandes
          </Text>
        </View>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{requests.length}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text style={styles.loadingText}>
            Chargement des demandes...
          </Text>
        </>
      ) : (
        <>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="calendar-clear-outline"
              size={36}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Aucune demande pour le moment
          </Text>

          <Text style={styles.emptyText}>
            Les demandes de visite reçues pour vos biens
            apparaîtront ici.
          </Text>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.countText}>{filteredRequests.length}</Text>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item, index) =>
          item.id?.toString() || `request-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.requestWrapper}>
            <RequestCard
              request={item}
              hideActions={false}
              onAccept={() => handleAccept(item.id)}
              onReject={() => handleReject(item.id)}
              processing={processingId === item.id}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchRequests(true)}
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
    marginBottom: 22,
    gap: 12,
  },

  titleContent: {
    flex: 1,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.6,
    marginBottom: 8,
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
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  summaryText: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.text,
  },

  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#E8F7F0",
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 12,
  },

  summaryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.green,
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
    minWidth: 34,
    height: 34,
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

  requestWrapper: {
    marginBottom: 14,
  },

  emptyContainer: {
    flex: 1,
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
    textAlign: "center",
    maxWidth: 280,
  },

  loadingText: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 14,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },

  filterButton: {
    overflow: "hidden",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#758198",
    fontSize: 12,
    fontWeight: "600",
  },

  filterButtonActive: {
    backgroundColor: "#1749A6",
    borderColor: "#1749A6",
    color: "#FFFFFF",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },
});
