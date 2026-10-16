import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import CategoryList from "./CategoryList";

export default function HomeHeader({
  unreadCount = 0,
  search,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <HeroSection unreadCount={unreadCount} />
      <SearchBar value={search} onChangeText={onSearchChange} />
      <CategoryList
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </View>
  );
}
