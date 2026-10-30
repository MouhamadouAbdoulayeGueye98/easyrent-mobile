import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";

export default function HomeHeader({
  unreadCount = 0,
  search,
  onSearchChange,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <HeroSection unreadCount={unreadCount} />
      <SearchBar value={search} onChangeText={onSearchChange} />
    </View>
  );
}
