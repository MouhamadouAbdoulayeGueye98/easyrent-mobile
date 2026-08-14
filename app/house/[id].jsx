import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCallback, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { startConversation } from "../../services/conversations";
import { getPropertyById } from "../../services/properties";

export default function HouseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { width } = Dimensions.get("window");
  const { favorites, toggleFavorite } = useFavorites();

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [contacting, setContacting] = useState(false);

  const isFavorite = favorites.includes(house?.id);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        try {
          const data = await getPropertyById(id);
          if (isActive) setHouse(data);
        } catch (error) {
          console.error("Erreur chargement annonce :", error);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      load();
      return () => {
        isActive = false;
      };
    }, [id])
  );

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
    console.log("Réservation pour :", house.title);
  }

  async function handleContact() {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    if (contacting) return;

    setContacting(true);
    try {
      const conversation = await startConversation(house.id);
      router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error("Erreur création conversation :", error);
      const message = error.response?.data?.message || "Impossible de contacter l'annonceur.";
      Alert.alert("Erreur", message);
    } finally {
      setContacting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!house) {
    return (
      <View style={styles.center}>
        <Text>Logement introuvable.</Text>
      </View>
    );
  }

  // Liste des équipements réellement présents, dérivée des booléens
  const equipmentLabels = {
    furnished: "Meublé",
    waterIncluded: "Eau incluse",
    electricityIncluded: "Électricité incluse",
    wifiAvailable: "Wifi disponible",
    parking: "Parking",
    airConditioning: "Climatisation",
    petsAllowed: "Animaux acceptés",
  };
  const activeEquipments = Object.entries(equipmentLabels).filter(
    ([key]) => house[key]
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      {/* Images */}
      {house.photos?.length > 0 ? (
        <>
          <FlatList
            data={house.photos}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Image source={{ uri: item.url }} style={[styles.image, { width }]} />
            )}
            onViewableItemsChanged={onViewRef}
            viewabilityConfig={viewConfigRef}
          />
          <View style={styles.pagination}>
            {house.photos.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentImage === index && styles.activeDot]}
              />
            ))}
          </View>
        </>
      ) : (
        <View style={[styles.image, styles.noImage, { width }]}>
          <Ionicons name="image-outline" size={48} color="#9CA3AF" />
        </View>
      )}

      {/* Retour & Favoris */}
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.circleButton} onPress={() => router.back()}>
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
        {house.verified && (
          <View style={styles.verifiedRow}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.verifiedText}>Annonce vérifiée</Text>
          </View>
        )}

        <Text style={styles.title}>{house.title}</Text>

        <Text style={styles.location}>
          📍 {house.quartier ? `${house.quartier}, ` : ""}{house.city}
        </Text>

        <Text style={styles.price}>
          {house.price.toLocaleString()} FCFA / mois
        </Text>

        <View style={styles.infoRow}>
          {house.rooms != null && (
            <View style={styles.infoBox}>
              <Ionicons name="bed-outline" size={22} color="#2563EB" />
              <Text>{house.rooms} pièce(s)</Text>
            </View>
          )}

          {house.surface != null && (
            <View style={styles.infoBox}>
              <Ionicons name="resize-outline" size={22} color="#2563EB" />
              <Text>{house.surface} m²</Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Ionicons name="home-outline" size={22} color="#2563EB" />
            <Text>{house.type}</Text>
          </View>
        </View>

        <Text style={styles.section}>Description</Text>
        <Text style={styles.description}>{house.description}</Text>

        {activeEquipments.length > 0 && (
          <>
            <Text style={styles.section}>Équipements</Text>
            {activeEquipments.map(([key, label]) => (
              <View key={key} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.feature}>{label}</Text>
              </View>
            ))}
          </>
        )}

        {house.owner && (
          <>
            <Text style={styles.section}>Annonceur</Text>
            <View style={styles.ownerRow}>
              <View style={styles.ownerAvatar}>
                <Ionicons name="person" size={20} color="#2563EB" />
              </View>
              <Text style={styles.ownerName}>{house.owner.name}</Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Prix</Text>
          <Text style={styles.bottomPrice}>{house.price.toLocaleString()} FCFA</Text>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContact}
            disabled={contacting}
          >
            {contacting ? (
              <ActivityIndicator color="#2563EB" size="small" />
            ) : (
              <Ionicons name="chatbubble-outline" size={22} color="#2563EB" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
            <Text style={styles.reserveText}>Réserver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { height: 320 },
  noImage: {
    height: 320,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
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
  activeDot: { width: 24, backgroundColor: "#FFFFFF" },
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
  content: { padding: 20 },
  verifiedRow: { flexDirection: "row", alignItems: "center" },
  verifiedText: { marginLeft: 6, color: "#10B981", fontWeight: "600", fontSize: 13 },
  title: { fontSize: 28, fontWeight: "bold", marginTop: 12 },
  location: { color: "#6B7280", marginTop: 8 },
  price: { fontSize: 26, color: "#2563EB", fontWeight: "bold", marginTop: 15 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 25 },
  infoBox: { alignItems: "center" },
  section: { fontSize: 22, fontWeight: "700", marginTop: 30, marginBottom: 10 },
  description: { color: "#4B5563", lineHeight: 24 },
  featureRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  feature: { marginLeft: 10, fontSize: 16 },
  ownerRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  ownerName: { fontSize: 16, fontWeight: "600", color: "#111827" },
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
  bottomPriceLabel: { color: "#6B7280", fontSize: 14 },
  bottomPrice: { fontSize: 20, fontWeight: "bold", color: "#2563EB" },
  bottomActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F5FF",
  },
  reserveButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  reserveText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});