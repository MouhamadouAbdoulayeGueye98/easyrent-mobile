import { FlatList, StyleSheet, View } from "react-native";

import CategoryCard from "./CategotyCard";
import { categories } from "../../constants/categories";

export default function CategoryList({
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <CategoryCard
            item={item}
            active={selectedCategory === item.name}
            onPress={() => onSelectCategory(item.name)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingLeft: 20,
    marginBottom: 10,
  },
});