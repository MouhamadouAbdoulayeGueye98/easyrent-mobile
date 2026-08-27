import { FlatList } from "react-native";
import SectionHeader from "./SectionHeader";
import HouseCard from "./HouseCard";

export default function NewSection({ houses }) {
  const newHouses = houses.filter((house) => {
    if (!house.createdAt) return false;
    const daysSinceCreation =
      (Date.now() - new Date(house.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation <= 7;
  });

  if (newHouses.length === 0) return null;

  return (
    <>
      <SectionHeader title="✨ Nouveautés" />
      <FlatList
        horizontal
        data={newHouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HouseCard house={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
      />
    </>
  );
}