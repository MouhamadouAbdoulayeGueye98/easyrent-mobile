import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../context/FavoritesContext";

export default function HouseCard({ house }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(house.id);

  const photoUrl = house.photos?.[0]?.url;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/house/${house.id}`)}
    >
      <View>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={styles.image}
          />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          </View>
        )}

        <TouchableOpacity
          style={styles.heart}
          onPress={() => toggleFavorite(house.id)}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={22}
            color={favorite ? "#EF4444" : "#111827"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{house.title}</Text>

        <Text style={styles.location}>
          📍 {house.quartier ? `${house.quartier}, ` : ""}{house.city}
        </Text>

        <Text style={styles.price}>
          {house.price.toLocaleString()} FCFA / mois
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",

    borderRadius: 20,

    marginHorizontal: 20,

    marginBottom: 20,

    overflow: "hidden",
  },

  image: {
    width: "100%",

    height: 220,
  },

  noImage: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  heart: {
    position: "absolute",

    right: 15,

    top: 15,

    backgroundColor: "#fff",

    width: 40,

    height: 40,

    borderRadius: 20,

    alignItems: "center",

    justifyContent: "center",
  },

  content: {
    padding: 15,
  },

  title: {
    fontSize: 20,

    fontWeight: "bold",
  },

  location: {
    color: "#666",

    marginTop: 8,
  },

  price: {
    color: "#2563EB",

    fontSize: 18,

    fontWeight: "bold",

    marginTop: 10,
  },
});
