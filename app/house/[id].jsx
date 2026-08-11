import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { useRef, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

import { houses } from "../../constants/houses";
import { useAuth } from "../../context/AuthContext";

import { useFavorites } from "../../context/FavoritesContext";

export default function HouseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { width } = Dimensions.get("window");
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(house?.id);


  const house = houses.find((item) => item.id === id);
  const [currentImage, setCurrentImage] = useState(0);

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentImage(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  function handleReservation() {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // pour l'instant on affiche juste un message
    console.log("Réservation pour :", house.title);

    // plus tard :
    // router.push(`/booking/${house.id}`)
  }

  if (!house) {
    return (
      <View style={styles.center}>
        <Text>Logement introuvable.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
    >
      {/* Image */}
      <FlatList
        data={house.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={[styles.image, { width }]} />
        )}
        onViewableItemsChanged={onViewRef}
        viewabilityConfig={viewConfigRef}
      />
      <View style={styles.pagination}>
        {house.images.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentImage === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Retour */}
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={() => toggleFavorite(house.id)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#EF4444" : "#111827"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Note */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color="#FBBF24" />
          <Text style={styles.rating}>{house.rating}</Text>
        </View>

        {/* Titre */}
        <Text style={styles.title}>{house.title}</Text>

        {/* Localisation */}
        <Text style={styles.location}>
          📍 {house.district}, {house.city}
        </Text>

        {/* Prix */}
        <Text style={styles.price}>
          {house.price.toLocaleString()} FCFA / mois
        </Text>

        {/* Informations */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Ionicons name="bed-outline" size={22} color="#2563EB" />
            <Text>{house.bedrooms} Chambre(s)</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="water-outline" size={22} color="#2563EB" />
            <Text>{house.bathrooms} SDB</Text>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="resize-outline" size={22} color="#2563EB" />
            <Text>{house.area} m²</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.section}>Description</Text>

        <Text style={styles.description}>{house.description}</Text>

        {/* Équipements */}
        <Text style={styles.section}>Équipements</Text>

        {house.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />

            <Text style={styles.feature}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Prix</Text>

          <Text style={styles.bottomPrice}>
            {house.price.toLocaleString()} FCFA
          </Text>
        </View>

        <TouchableOpacity
          style={styles.reserveButton}
          onPress={handleReservation}
        >
          <Text style={styles.reserveText}>Réserver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 18,

    backgroundColor: "#FFFFFF",

    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",

    elevation: 20,
  },

  bottomPriceLabel: {
    color: "#6B7280",
    fontSize: 14,
  },

  bottomPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563EB",
  },

  reserveButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },

  reserveText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  pagination: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    flexDirection: "row",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 24,
    backgroundColor: "#FFFFFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    height: 320,
  },

  headerButtons: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 20,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rating: {
    marginLeft: 5,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 12,
  },

  location: {
    color: "#6B7280",
    marginTop: 8,
  },

  price: {
    fontSize: 26,
    color: "#2563EB",
    fontWeight: "bold",
    marginTop: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  infoBox: {
    alignItems: "center",
  },

  section: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 10,
  },

  description: {
    color: "#4B5563",
    lineHeight: 24,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  feature: {
    marginLeft: 10,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    marginTop: 35,
    marginBottom: 40,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
