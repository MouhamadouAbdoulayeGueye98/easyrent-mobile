import { useCallback, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import HouseCard from "../../components/ui/HouseCard";
import GuestScreen from "../../components/common/GuestScreen";
import { useFavorites } from "../../context/FavoritesContext";
import { getProperties } from "../../services/properties";

export default function Favorites() {
  const { user } = useAuth();
  const { favorites, loadFavorites } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setProperties([]);
        setLoading(false);
        return;
      }

      let isActive = true;

      async function load() {
        try {
          setLoading(true);
          await loadFavorites();
          const data = await getProperties();

          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : [];

          setProperties(list);
        } catch (error) {
          console.error("Erreur chargement favoris :", error);
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

  const favoriteProperties = (
    Array.isArray(properties) ? properties : []
  ).filter((property) =>
    (favorites || []).map(String).includes(String(property.id)),
  );

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

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Mes favoris" />
        <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 40 }} />
      </View>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Mes favoris" />
        <View style={styles.emptyContainer}>
          <Text style={styles.emoji}>❤️</Text>
          <Text style={styles.title}>Aucun favori</Text>
          <Text style={styles.subtitle}>
            Ajoutez des logements à vos favoris pour les retrouver rapidement.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mes favoris" />
      <FlatList
        data={favoriteProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HouseCard house={item} variant="large" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F8FAFC",
  },

  emoji: {
    fontSize: 70,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 12,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 24,
    fontSize: 16,
  },
});