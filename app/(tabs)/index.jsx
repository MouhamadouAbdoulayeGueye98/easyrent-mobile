import { ScrollView, ActivityIndicator, View, Text } from "react-native";
import { useMemo, useState } from "react";

import { useGetPropertiesQuery } from "../../services/api";

import HeroSection from "../../components/home/HeroSection";
import SearchBar from "../../components/home/SearchBar";
import CategoryList from "../../components/home/CategoryList";
import PopularSection from "../../components/home/PopularSection";
import NewSection from "../../components/home/NewSection";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Utilisation directe du hook RTK Query (gère le chargement et les données automatiquement)
  const { data: houses = [], isLoading, error } = useGetPropertiesQuery();

  const filteredHouses = useMemo(() => {
    let result = houses;

    if (search.trim()) {
      const text = search.toLowerCase().trim();
      result = result.filter(
        (house) =>
          house.title?.toLowerCase().includes(text) ||
          house.city?.toLowerCase().includes(text) ||
          house.quartier?.toLowerCase().includes(text)
      );
    }

    if (selectedCategory !== "Tous") {
      result = result.filter((house) => house.type === selectedCategory.toUpperCase());
    }

    return result;
  }, [search, selectedCategory, houses]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "#EF4444", textAlign: "center" }}>Erreur lors du chargement des annonces.</Text>
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