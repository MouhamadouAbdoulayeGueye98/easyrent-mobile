import { ScrollView, ActivityIndicator, View, Text } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getProperties } from "../../services/properties";
import { getNotifications } from "../../services/notifications";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

import HomeHeader from "../../components/home/HomeHeader";
import PopularSection from "../../components/home/PopularSection";
import NewSection from "../../components/home/NewSection";

export default function Home() {
  const { user } = useAuth();
  const { loadFavorites } = useFavorites();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    async function load() {
      try {
        if (user) {
          await loadFavorites();
        }
        const properties = await getProperties();

        if (isActive) {
          setHouses(properties);
        }
      } catch (error) {
        console.error("Erreur chargement annonces :", error);
      }

      try {
        const notifications = await getNotifications();

        if (isActive) {
          const unread = notifications.filter(
            (notification) => !notification.read
          ).length;

          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Erreur chargement notifications :", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isActive = false;
    };
  }, [user, loadFavorites])
);

  const filteredHouses = useMemo(() => {
    let result = houses;

    if (search.trim()) {
      const text = search.toLowerCase().trim();
      result = result.filter(
        (house) =>
          house.title.toLowerCase().includes(text) ||
          house.city.toLowerCase().includes(text) ||
          house.quartier?.toLowerCase().includes(text)
      );
    }

    if (selectedCategory !== "Tous") {
      result = result.filter((house) => house.type === selectedCategory.toUpperCase());
    }

    return result;
  }, [search, selectedCategory, houses]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <HomeHeader
        unreadCount={unreadCount}
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {filteredHouses.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: "#6B7280" }}>Aucune annonce trouvée.</Text>
          </View>
        ) : (
          <>
            <PopularSection houses={filteredHouses} />
            <NewSection houses={filteredHouses} />
          </>
        )}
      </ScrollView>
    </View>
  );
}