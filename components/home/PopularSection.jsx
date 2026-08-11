import { FlatList } from "react-native";

import SectionHeader from "./SectionHeader";
import HouseCard from "./HouseCard";

export default function PopularSection({
  houses,
}) {
  return (
    <>
      <SectionHeader title="🔥 Populaires" />

      <FlatList
        horizontal
        data={houses}
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