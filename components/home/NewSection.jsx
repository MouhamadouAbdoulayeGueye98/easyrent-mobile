import { FlatList } from "react-native";

import SectionHeader from "./SectionHeader";
import HouseCard from "./HouseCard";


export default function NewSection({
  houses,
}) {

  const newHouses = houses.filter(
    (house) => house.isNew
  );


  return (
    <>
      <SectionHeader 
        title="✨ Nouveautés"
      />


      <FlatList
        horizontal

        data={newHouses}

        keyExtractor={(item) => item.id}

        renderItem={({item}) => (
          <HouseCard house={item}/>
        )}

        showsHorizontalScrollIndicator={false}

        contentContainerStyle={{
          paddingHorizontal:20,
          paddingBottom:30,
        }}
      />

    </>
  );
}