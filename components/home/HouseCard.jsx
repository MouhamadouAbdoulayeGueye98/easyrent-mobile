import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { useFavorites } from "../../context/FavoritesContext";
import { isRecent } from "../../utils/dates";

export default function HouseCard({ house, variant = "horizontal" }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const cardStyle = {
    width: variant === "horizontal" ? 280 : "100%",
    marginRight: variant === "horizontal" ? 16 : 0,
    marginBottom: variant === "grid" ? 0 : 20,
    alignSelf: variant === "large" ? "center" : "auto",
  };

  const imageStyle = {
    height:
      variant === "horizontal" ? 220 : variant === "grid" ? 150 : 250,
  };

  const photoUrl = house.photos?.[0]?.url;

  // "Nouveau" dérivé : créé il y a moins de 7 jours
  const isNew = isRecent(house.createdAt);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, cardStyle]}
      onPress={() => router.push(`/house/${house.id}`)}
    >
      <View style={styles.imageContainer}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={[styles.image, imageStyle]} />
        ) : (
          <View style={[styles.image, imageStyle, styles.noImage]}>
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          </View>
        )}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.25)"]}
          style={styles.gradient}
        />

        {isNew && (
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

      <View style={[styles.content, variant === "grid" && styles.gridContent]}>
        {house.verified && (
          <View style={styles.ratingContainer}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.rating}>Vérifié</Text>
          </View>
        )}

        <Text
          style={[styles.title, variant === "grid" && styles.gridTitle]}
          numberOfLines={1}
        >
          {house.title}
        </Text>

        <Text
          style={[styles.location, variant === "grid" && styles.gridLocation]}
          numberOfLines={1}
        >
          📍 {house.quartier ? `${house.quartier}, ` : ""}{house.city}
        </Text>

        <View style={[styles.infoRow, variant === "grid" && styles.gridInfoRow]}>
          {house.rooms != null && <Text style={styles.info}>🛏️ {house.rooms}</Text>}
          {house.surface != null && <Text style={styles.info}>📐 {house.surface} m²</Text>}
          <Text style={styles.info}>{house.type}</Text>
        </View>

        <Text style={[styles.price, variant === "grid" && styles.gridPrice]}>
          {house.price.toLocaleString()} FCFA / mois
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, overflow: "hidden", backgroundColor: "#FFFFFF", elevation: 6 },
  imageContainer: { position: "relative" },
  image: { width: "100%" },
  noImage: { backgroundColor: "#F3F4F6", justifyContent: "center", alignItems: "center" },
  gradient: { ...StyleSheet.absoluteFillObject },
  favoriteButton: {
    position: "absolute", top: 15, right: 15, width: 42, height: 42,
    borderRadius: 21, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center",
  },
  badge: {
    position: "absolute", top: 15, left: 15, backgroundColor: "#2563EB",
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  badgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
  content: { padding: 16 },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  rating: { marginLeft: 5, fontWeight: "600", color: "#10B981", fontSize: 13 },
  title: { fontSize: 20, fontWeight: "700", marginTop: 8 },
  location: { marginTop: 6, color: "#6B7280" },
  infoRow: { flexDirection: "row", gap: 14, marginTop: 14 },
  info: { color: "#374151", fontWeight: "500" },
  price: { marginTop: 16, fontSize: 22, fontWeight: "bold", color: "#2563EB" },
  gridContent: { padding: 12 },
  gridTitle: { fontSize: 16, marginTop: 4 },
  gridLocation: { marginTop: 4, fontSize: 12 },
  gridInfoRow: { gap: 8, marginTop: 8, flexWrap: "wrap" },
  gridPrice: { marginTop: 10, fontSize: 16 },
});