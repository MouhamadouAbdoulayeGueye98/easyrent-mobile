
import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import ListingCard from "../../components/publisher/ListingCard";
import EmptyListings from "../../components/publisher/EmptyListings";
import { getMyProperties } from "../../services/propertyService";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  background: "#F4F7FC",
  surface: "#FFFFFF",
  text: "#172033",
  muted: "#758198",
  border: "#E2E8F0",
  blueSoft: "#EAF1FF",
};

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadListings = useCallback(async () => {
    try {
      setError(null);

      const data = await getMyProperties();
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur chargement mes annonces :", error);
      setError("Impossible de charger vos annonces.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [loadListings])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadListings();
  }, [loadListings]);

  const renderIntro = () => (
    <View style={styles.intro}>
      <View style={styles.titleRow}>
        <View style={styles.titleContent}>
          <Text style={styles.pageTitle}>Mes annonces</Text>
          <Text style={styles.subtitle}>
            Retrouvez et gérez tous vos biens immobiliers.
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="business-outline"
            size={27}
            color={COLORS.primary}
          />
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="home-outline"
            size={25}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>
            Total de mes annonces
          </Text>
          <Text style={styles.summaryValue}>
            {listings.length}
          </Text>
        </View>

        <View style={styles.summaryRight}>
          <Ionicons
            name="layers-outline"
            size={20}
            color={COLORS.primary}
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Votre portefeuille immobilier
          </Text>
          <Text style={styles.sectionSubtitle}>
            {listings.length === 1
              ? "1 bien enregistré"
              : `${listings.length} biens enregistrés`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => router.push("/publisher-create")}
        >
          <Ionicons name="add" size={19} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Mes annonces" />

        <View style={styles.center}>
          <View style={styles.loadingIcon}>
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.loadingTitle}>
            Chargement de vos annonces
          </Text>
          <Text style={styles.loadingText}>
            Nous récupérons vos biens immobiliers...
          </Text>
        </View>
      </View>
    );
  }

  if (error && listings.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Mes annonces" />

        <View style={styles.center}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="cloud-offline-outline"
              size={35}
              color="#DC2626"
            />
          </View>

          <Text style={styles.errorTitle}>
            Chargement impossible
          </Text>
          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadListings();
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.retryButtonText}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Mes annonces" />
        <EmptyListings
          onPress={() => router.push("/publisher-create")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={listings}
        keyExtractor={(item, index) =>
          item.id?.toString() || `listing-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.listingWrapper}>
            <ListingCard listing={item} />
          </View>
        )}
        ListHeaderComponent={renderIntro}
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
        ListFooterComponent={
          error ? (
            <TouchableOpacity
              style={styles.inlineError}
              onPress={onRefresh}
              activeOpacity={0.8}
            >
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color="#DC2626"
              />
              <Text style={styles.inlineErrorText}>
                Actualisation impossible. Appuyez pour réessayer.
              </Text>
            </TouchableOpacity>
          ) : null
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
  },

  intro: {
    marginBottom: 10,
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
    gap: 13,
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

  summaryRight: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: "#F4F7FC",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 17,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 5,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 13,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  listingWrapper: {
    marginBottom: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 28,
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

  loadingTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },

  loadingText: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },

  errorIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },

  errorText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.muted,
    textAlign: "center",
    marginBottom: 20,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 13,
  },

  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  inlineError: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
  },

  inlineErrorText: {
    flex: 1,
    fontSize: 12,
    color: "#B91C1C",
  },
});
