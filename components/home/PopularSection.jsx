import { FlatList } from "react-native";

import SectionHeader from "./SectionHeader";
import HouseCard from "./HouseCard";
import { HOME_SECTION_LIMIT } from "../../constants/home";

export default function PopularSection({ houses, onSeeAll }) {
  const visibleHouses = houses.slice(0, HOME_SECTION_LIMIT);

  return (
    <>
      <SectionHeader title="🔥 Populaires" onPress={onSeeAll} />

      <FlatList
        horizontal
        data={visibleHouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HouseCard house={item} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 10,
        }}
      />
      
    </>
  );
}
