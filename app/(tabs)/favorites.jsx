
import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import HouseCard from "../../components/ui/HouseCard";
import GuestScreen from "../../components/common/GuestScreen";
import { useFavorites } from "../../context/FavoritesContext";
import { getProperties } from "../../services/properties";

const COLORS = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  background: "#F8FAFC",
  white: "#FFFFFF",
  text: "#111827",
  secondary: "#6B7280",
  muted: "#9CA3AF",
  border: "#E5E7EB",
  danger: "#DC2626",
};

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loadFavorites } = useFavorites();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadData = useCallback(async (isRefresh = false) => {
    if (!user) {
      setProperties([]);
      setLoading(false);
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(false);

      await loadFavorites();

      const data = await getProperties();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setProperties(list);
    } catch (err) {
      console.error("Erreur chargement favoris :", err);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, loadFavorites]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (!user) {
        setProperties([]);
        setLoading(false);
        return;
      }

      async function load() {
        try {
          setLoading(true);
          setError(false);

          await loadFavorites();

          const data = await getProperties();

          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];

          if (isActive) {
            setProperties(list);
          }
        } catch (err) {
          console.error("Erreur chargement favoris :", err);
          if (isActive) setError(true);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [user, loadFavorites])
  );

  const favoriteIds = (favorites || []).map(String);

  const favoriteProperties = (
    Array.isArray(properties) ? properties : []
  ).filter((property) =>
    favoriteIds.includes(String(property.id))
  );

  // ÉCRAN INVITÉ
  if (!user) {
    return (
      <View style={styles.container}>
        <GuestScreen
          icon="heart-outline"
          title="Vos favoris vous attendent"
          description="Connectez-vous pour sauvegarder vos logements préférés et les retrouver facilement."
        />
      </View>
    );
  }

  // CHARGEMENT
  if (loading) {
    return (
      <View style={styles.container}>

        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text style={styles.loadingText}>
            Chargement de vos favoris...
          </Text>
        </View>
      </View>
    );
  }

  // ERREUR
  if (error && favoriteProperties.length === 0) {
    return (
      <View style={styles.container}>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={38}
              color={COLORS.secondary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Impossible de charger vos favoris
          </Text>

          <Text style={styles.emptySubtitle}>
            Vérifiez votre connexion et réessayez.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadData()}
            activeOpacity={0.8}
          >
            <Ionicons
              name="refresh"
              size={17}
              color={COLORS.white}
            />
            <Text style={styles.retryText}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // AUCUN FAVORI
  if (favoriteProperties.length === 0) {
    return (
      <View style={styles.container}>
        

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons
              name="heart"
              size={42}
              color="#F87171"
            />
          </View>

          <Text style={styles.emptyTitle}>
            Aucun favori pour le moment
          </Text>

          <Text style={styles.emptySubtitle}>
            Retrouvez ici tous les logements que vous aimez.
            Ajoutez vos annonces préférées en cliquant sur le cœur.
          </Text>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push("/(tabs)")}
            activeOpacity={0.85}
          >
            <Text style={styles.exploreButtonText}>
              Explorer les logements
            </Text>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // LISTE DES FAVORIS
  return (
    <View style={styles.container}>
      

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Vos logements préférés
            </Text>
            <Text style={styles.sectionSubtitle}>
              Retrouvez facilement vos annonces sauvegardées.
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Ionicons
              name="heart"
              size={13}
              color={COLORS.primary}
            />
            <Text style={styles.countText}>
              {favoriteProperties.length}
            </Text>
          </View>
        </View>

        <FlatList
          data={favoriteProperties}
          keyExtractor={(item, index) =>
            String(item?.id ?? index)
          }
          renderItem={({ item }) => (
            <HouseCard
              house={item}
              variant="large"
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadData(true)}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 24,
  },

  content: {
    flex: 1,
  },

  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 5,
  },

  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },

  countText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 15,
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: "500",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 12,
    textAlign: "center",
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 22,
  },

  exploreButton: {
    marginTop: 25,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  exploreButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  retryButton: {
    marginTop: 22,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  retryText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
