import { FlatList } from "react-native";
import SectionHeader from "./SectionHeader";
import HouseCard from "./HouseCard";
import { HOME_SECTION_LIMIT } from "../../constants/home";
import { isRecent } from "../../utils/dates";

export default function NewSection({ houses, onSeeAll }) {
  const newHouses = houses.filter((house) => isRecent(house.createdAt));

  if (newHouses.length === 0) return null;

  const visibleHouses = newHouses.slice(0, HOME_SECTION_LIMIT);

  return (
    <>
      <SectionHeader title="✨ Nouveautés" onPress={onSeeAll} />
      <FlatList
        horizontal
        data={visibleHouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HouseCard house={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
      />
    </>
  );
}
