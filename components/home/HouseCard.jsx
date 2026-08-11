import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
// import { useState } from "react";

import { useFavorites } from "../../context/FavoritesContext";

export default function HouseCard({
  house,
  variant = "horizontal",
}) {
  // const [favorite, setFavorite] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  // Styles dynamiques selon la variante
  const cardStyle = {
    width: variant === "horizontal" ? 280 : "100%",
    marginRight: variant === "horizontal" ? 16 : 0,
    marginBottom: 20,
    alignSelf: variant === "large" ? "center" : "auto",
  };

  const imageStyle = {
    height: variant === "horizontal" ? 220 : 250,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, cardStyle]}
      onPress={() => router.push(`/house/${house.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={house.images[0]} style={[styles.image, imageStyle]} />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.25)"]}
          style={styles.gradient}
        />

        {house.isNew && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Nouveau</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(house.id);
          }}
        >
          <Ionicons
            name={isFavorite(house.id) ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite(house.id) ? "#EF4444" : "#111827"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FBBF24" />

          <Text style={styles.rating}>{house.rating}</Text>
        </View>

        <Text style={styles.title}>{house.title}</Text>

        <Text style={styles.location}>
          📍 {house.district}, {house.city}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.info}>🛏️ {house.bedrooms}</Text>

          <Text style={styles.info}>🚿 {house.bathrooms}</Text>

          <Text style={styles.info}>📐 {house.area} m²</Text>
        </View>

        <Text style={styles.price}>
          {house.price.toLocaleString()} FCFA / mois
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 6,
  },

  imageContainer: {
    position: "relative",
  },

  image: {
    width: "100%",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  favoriteButton: {
    position: "absolute",
    top: 15,
    right: 15,

    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: 15,
    left: 15,

    backgroundColor: "#2563EB",

    borderRadius: 20,

    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  content: {
    padding: 16,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rating: {
    marginLeft: 5,
    fontWeight: "600",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
  },

  location: {
    marginTop: 6,
    color: "#6B7280",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },

  info: {
    color: "#374151",
    fontWeight: "500",
  },

  price: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563EB",
  },
});