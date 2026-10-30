import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { getNotifications } from "../../services/notifications";
import { getProperties } from "../../services/properties";

import CategoryList from "../../components/home/CategoryList";
import HomeHeader from "../../components/home/HomeHeader";
import NewSection from "../../components/home/NewSection";
import PopularSection from "../../components/home/PopularSection";

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

          const list = Array.isArray(properties)
            ? properties
            : Array.isArray(properties?.data)
              ? properties.data
              : [];

          if (isActive) {
            setHouses(list);
          }
        } catch (error) {
          console.error("Erreur chargement annonces :", error);
        }

        if (user) {
          try {
            const notifications = await getNotifications();

            if (isActive) {
              const list = Array.isArray(notifications) ? notifications : [];

              setUnreadCount(
                list.filter((notification) => !notification.read).length,
              );
            }
          } catch (error) {
            console.error(
              "Erreur chargement notifications :",
              error.response?.status || error.code || error.message,
            );
          }
        } else if (isActive) {
          setUnreadCount(0);
        }

        if (isActive) {
          setLoading(false);
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [user, loadFavorites]),
  );

  const filteredHouses = useMemo(() => {
    let result = houses;

    if (search.trim()) {
      const text = search.toLowerCase().trim();
      result = result.filter(
        (house) =>
          (house.title || "").toLowerCase().includes(text) ||
          (house.city || "").toLowerCase().includes(text) ||
          (house.quartier || "").toLowerCase().includes(text),
      );
    }

    if (selectedCategory !== "Tous") {
      result = result.filter(
        (house) => house.type === selectedCategory.toUpperCase(),
      );
    }

    return result;
  }, [search, selectedCategory, houses]);

  const openPropertiesList = (section) => {
    router.push({
      pathname: "/properties",
      params: {
        section,
        ...(search.trim() ? { search: search.trim() } : {}),
        ...(selectedCategory !== "Tous"
          ? { type: selectedCategory.toUpperCase() }
          : {}),
      },
    });
  };

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
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {filteredHouses.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: "#6B7280" }}>Aucune annonce trouvée.</Text>
          </View>
        ) : (
          <>
            <PopularSection
              houses={filteredHouses}
              onSeeAll={() => openPropertiesList("popular")}
            />
            <NewSection
              houses={filteredHouses}
              onSeeAll={() => openPropertiesList("new")}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}
