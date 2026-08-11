import { View, FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";

import Header from "../../components/common/Header";
import ListingCard from "../../components/publisher/ListingCard";
import EmptyListings from "../../components/publisher/EmptyListings";

const listings = [
  {
    id: "1",
    title: "Appartement F4",
    city: "Dakar",
    price: 450000,
    views: 245,
    requests: 12,
    image: require("../../assets/images/image1.jpg"),
  },
  {
    id: "2",
    title: "Studio moderne",
    city: "Ouakam",
    price: 180000,
    views: 98,
    requests: 4,
    image: require("../../assets/images/image2.jpg"),
  },
];

export default function Listings() {
  if (listings.length === 0) {
    return (
      <EmptyListings
        onPress={() => router.push("/publisher/create")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mes annonces" />

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard listing={item} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  list: {
    padding: 20,
    paddingBottom: 40,
  },
});