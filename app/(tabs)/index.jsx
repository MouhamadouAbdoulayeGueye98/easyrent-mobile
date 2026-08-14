import { ScrollView, ActivityIndicator, View, Text } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import { getProperties } from "../../services/properties";

import HeroSection from "../../components/home/HeroSection";
import SearchBar from "../../components/home/SearchBar";
import CategoryList from "../../components/home/CategoryList";
import PopularSection from "../../components/home/PopularSection";
import NewSection from "../../components/home/NewSection";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        try {
          const data = await getProperties();
          if (isActive) setHouses(data);
        } catch (error) {
          console.error("Erreur chargement annonces :", error);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      load();
      return () => {
        isActive = false;
      };
    }, [])
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
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeroSection />

      <SearchBar value={search} onChangeText={setSearch} />

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
          <PopularSection houses={filteredHouses} />
          <NewSection houses={filteredHouses} />
        </>
      )}
    </ScrollView>
  );
}