
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { useFavorites } from "../../context/FavoritesContext";
import { isRecent } from "../../utils/dates";

const COLORS = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  text: "#111827",
  secondary: "#6B7280",
  muted: "#9CA3AF",
  white: "#FFFFFF",
  background: "#F3F4F6",
  success: "#059669",
  danger: "#EF4444",
  border: "#E5E7EB",
};

export default function HouseCard({ house, variant = "horizontal" }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!house) return null;

  const isHorizontal = variant === "horizontal";
  const isGrid = variant === "grid";
  const isLarge = variant === "large";

  const favorite = isFavorite(house.id);
  const photoUrl = house.photos?.[0]?.url;
  const isNew = house.createdAt ? isRecent(house.createdAt) : false;

  const price = Number(house.price);
  const formattedPrice = Number.isFinite(price)
    ? price.toLocaleString("fr-FR")
    : "Prix non disponible";

  const location = [
    house.quartier,
    house.city,
  ].filter(Boolean).join(", ");

  const cardWidth = isHorizontal ? 280 : "100%";
  const imageHeight = isHorizontal ? 190 : isGrid ? 145 : 245;

  const handlePress = () => {
    if (!house.id) return;
    router.push(`/house/${house.id}`);
  };

  const handleFavorite = (event) => {
    event.stopPropagation();
    toggleFavorite(house.id);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.96}
      style={[
        styles.card,
        {
          width: cardWidth,
          marginRight: isHorizontal ? 16 : 0,
          marginBottom: isGrid ? 0 : 18,
          alignSelf: isLarge ? "center" : "auto",
        },
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Voir le logement ${house.title || ""}`}
    >
      {/* IMAGE */}
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImage}>
            <Ionicons
              name="home-outline"
              size={42}
              color={COLORS.muted}
            />
            <Text style={styles.noImageText}>
              Aucune photo disponible
            </Text>
          </View>
        )}

        <LinearGradient
          colors={[
            "rgba(0,0,0,0.12)",
            "transparent",
            "rgba(0,0,0,0.18)",
          ]}
          locations={[0, 0.45, 1]}
          style={styles.gradient}
          pointerEvents="none"
        />

        {/* BADGES */}
        <View style={styles.topBadges}>
          {isNew && (
            <View style={styles.newBadge}>
              <View style={styles.newDot} />
              <Text style={styles.newBadgeText}>Nouveau</Text>
            </View>
          )}

          {house.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="shield-checkmark"
                size={13}
                color={COLORS.success}
              />
              <Text style={styles.verifiedText}>Vérifié</Text>
            </View>
          )}
        </View>

        {/* FAVORIS */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavorite}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={
            favorite ? "Retirer des favoris" : "Ajouter aux favoris"
          }
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={21}
            color={favorite ? COLORS.danger : COLORS.text}
          />
        </TouchableOpacity>

        {/* TYPE DE LOGEMENT */}
        {house.type && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{house.type}</Text>
          </View>
        )}
      </View>

      {/* INFORMATIONS */}
      <View
        style={[
          styles.content,
          isGrid && styles.gridContent,
        ]}
      >
        <Text
          style={[
            styles.title,
            isGrid && styles.gridTitle,
          ]}
          numberOfLines={1}
        >
          {house.title || "Logement sans titre"}
        </Text>

        {location ? (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={15}
              color={COLORS.secondary}
            />
            <Text
              style={[
                styles.location,
                isGrid && styles.gridLocation,
              ]}
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>
        ) : null}

        {/* CARACTERISTIQUES */}
        <View
          style={[
            styles.infoRow,
            isGrid && styles.gridInfoRow,
          ]}
        >
          {house.rooms != null && (
            <View style={styles.infoItem}>
              <Ionicons
                name="bed-outline"
                size={16}
                color={COLORS.secondary}
              />
              <Text style={styles.infoText}>
                {house.rooms} ch.
              </Text>
            </View>
          )}

          {house.surface != null && (
            <View style={styles.infoItem}>
              <Ionicons
                name="resize-outline"
                size={16}
                color={COLORS.secondary}
              />
              <Text style={styles.infoText}>
                {house.surface} m²
              </Text>
            </View>
          )}

          {house.type && (
            <View style={styles.infoItem}>
              <Ionicons
                name="business-outline"
                size={16}
                color={COLORS.secondary}
              />
              <Text style={styles.infoText} numberOfLines={1}>
                {house.type}
              </Text>
            </View>
          )}
        </View>

        {/* PRIX */}
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}>
            <Text
              style={[
                styles.price,
                isGrid && styles.gridPrice,
              ]}
              numberOfLines={1}
            >
              {formattedPrice}
            </Text>

            {Number.isFinite(price) && (
              <Text style={styles.currency}>FCFA</Text>
            )}
          </View>

          <Text style={styles.pricePeriod}>par mois</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F2F4",
  },

  imageContainer: {
    width: "100%",
    position: "relative",
    backgroundColor: COLORS.background,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },

  noImageText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 8,
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  topBadges: {
    position: "absolute",
    top: 13,
    left: 13,
    right: 65,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },

  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 30,
    marginRight: 7,
    marginBottom: 5,
  },

  newDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },

  newBadgeText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 30,
    marginBottom: 5,
  },

  verifiedText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 5,
  },

  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  typeBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(17, 24, 39, 0.75)",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
  },

  typeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
  },

  content: {
    padding: 15,
  },

  gridContent: {
    padding: 12,
  },

  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  gridTitle: {
    fontSize: 15,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  location: {
    color: COLORS.secondary,
    fontSize: 13,
    marginLeft: 4,
    flex: 1,
  },

  gridLocation: {
    fontSize: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 14,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  gridInfoRow: {
    marginTop: 11,
    paddingBottom: 10,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 3,
  },

  infoText: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 5,
  },

  priceContainer: {
    marginTop: 12,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },

  price: {
    color: COLORS.primary,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  gridPrice: {
    fontSize: 17,
  },

  currency: {
    color: COLORS.primaryDark,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },

  pricePeriod: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 2,
  },
});
