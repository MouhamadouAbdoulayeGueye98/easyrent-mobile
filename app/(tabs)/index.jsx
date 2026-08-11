import { ScrollView } from "react-native";
import { useMemo, useState } from "react";

import { houses } from "../../constants/houses";

import HeroSection from "../../components/home/HeroSection";
import SearchBar from "../../components/home/SearchBar";
import CategoryList from "../../components/home/CategoryList";
import PopularSection from "../../components/home/PopularSection";
import NewSection from "../../components/home/NewSection";


export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredHouses = useMemo(() => {
    let result = houses;

    
    // Recherche
    if (search.trim()) {
      const text = search.toLowerCase().trim();

      result = result.filter(
        (house) =>
          house.title.toLowerCase().includes(text) ||
          house.city.toLowerCase().includes(text) ||
          house.district.toLowerCase().includes(text)
      );
    }

    // Filtre catégorie
    if (selectedCategory !== "Tous") {
      result = result.filter(
        (house) => house.type === selectedCategory
      );
    }

    return result;
  }, [search, selectedCategory]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeroSection />

      <SearchBar
        value={search}
        onChangeText={setSearch}
      />

      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <PopularSection houses={filteredHouses} />

      <NewSection houses={filteredHouses} />
    </ScrollView>
  );
}