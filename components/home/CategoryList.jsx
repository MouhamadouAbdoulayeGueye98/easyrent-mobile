
import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";

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
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    marginTop: 18,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  separator: {
    width: 12,
  },
});
