
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  router,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { startConversation } from "../../services/conversations";
import { getPropertyById } from "../../services/properties";
import { createVisit } from "../../services/visits";
import VisitModal from "../../components/common/VisitModal";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  background: "#F8FAFC",
  white: "#FFFFFF",
  text: "#111827",
  secondary: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  success: "#059669",
  successLight: "#ECFDF5",
  danger: "#EF4444",
};

const equipmentLabels = {
  furnished: "Meublé",
  waterIncluded: "Eau incluse",
  electricityIncluded: "Électricité incluse",
  wifiAvailable: "Wifi disponible",
  parking: "Parking",
  airConditioning: "Climatisation",
  petsAllowed: "Animaux acceptés",
};

const formatPrice = (price) => {
  const value = Number(price || 0);
  return value.toLocaleString("fr-FR");
};

export default function HouseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { favorites, toggleFavorite, loadFavorites } = useFavorites();

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [contacting, setContacting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isFavorite = favorites.includes(house?.id);
  const photos = house?.photos || [];

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        setLoading(true);

        try {
          if (user) {
            await loadFavorites();
          }

          const data = await getPropertyById(id);

          if (isActive) {
            setHouse(data);
            setCurrentImage(0);
          }
        } catch (error) {
          console.error("Erreur chargement annonce :", error);

          if (isActive) {
            setHouse(null);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      load();

      return () => {
        isActive = false;
      };
    }, [id, user, loadFavorites])
  );

  function handleReservation() {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setIsModalVisible(true);
  }

  async function handleSendVisitRequest({ dateTime }) {
    try {
      await createVisit({
        propertyId: house?.id,
        date: dateTime,
      });

      setIsModalVisible(false);

      Alert.alert(
        "Demande envoyée",
        "Votre demande de visite a bien été envoyée. Vous serez informé de son évolution."
      );
    } catch (error) {
      console.error("Erreur création visite :", error);

      const message =
        error.response?.data?.message ||
        "Impossible d'envoyer la demande de visite.";

      Alert.alert("Erreur", message);
    }
  }

  async function handleContact() {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (contacting || !house?.id) return;

    setContacting(true);

    try {
      const conversation = await startConversation(house.id);
      router.push(`/chat/${conversation.id}`);
    } catch (error) {
      console.error("Erreur création conversation :", error);

      const message =
        error.response?.data?.message ||
        "Impossible de contacter l'annonceur.";

      Alert.alert("Erreur", message);
    } finally {
      setContacting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement du logement...</Text>
      </View>
    );
  }

  if (!house) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="home-outline"
            size={36}
            color={COLORS.secondary}
          />
        </View>

        <Text style={styles.errorTitle}>Logement introuvable</Text>
        <Text style={styles.errorDescription}>
          Cette annonce n'est peut-être plus disponible.
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activeEquipments = Object.entries(equipmentLabels).filter(
    ([key]) => house[key]
  );

  const location = [
    house.quartier,
    house.city,
  ].filter(Boolean).join(", ");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Galerie photos */}
        <View style={styles.gallery}>
          {photos.length > 0 ? (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x / width
                  );
                  setCurrentImage(index);
                }}
              >
                {photos.map((photo, index) => (
                  <Image
                    key={photo.id || index}
                    source={{ uri: photo.url }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              <View style={styles.imageCounter}>
                <Ionicons
                  name="images-outline"
                  size={14}
                  color={COLORS.white}
                />
                <Text style={styles.imageCounterText}>
                  {currentImage + 1} / {photos.length}
                </Text>
              </View>

              <View style={styles.pagination}>
                {photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentImage === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noImage}>
              <Ionicons
                name="image-outline"
                size={52}
                color={COLORS.muted}
              />
              <Text style={styles.noImageText}>
                Aucune photo disponible
              </Text>
            </View>
          )}

          {/* Boutons retour et favori */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={COLORS.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => toggleFavorite(house.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? COLORS.danger : COLORS.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations principales */}
        <View style={styles.content}>
          {house.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="shield-checkmark"
                size={15}
                color={COLORS.success}
              />
              <Text style={styles.verifiedText}>Annonce vérifiée</Text>
            </View>
          )}

          <Text style={styles.title}>{house.title}</Text>

          {!!location && (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color={COLORS.secondary}
              />
              <Text style={styles.location}>{location}</Text>
            </View>
          )}

          {/* Prix */}
          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Loyer mensuel</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>
                  {formatPrice(house.price)}
                </Text>
                <Text style={styles.currency}> FCFA</Text>
              </View>
            </View>

            <View style={styles.priceIcon}>
              <Ionicons
                name="wallet-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>
          </View>

          {/* Caractéristiques */}
          <Text style={styles.sectionTitle}>Caractéristiques</Text>

          <View style={styles.infoGrid}>
            {house.rooms != null && (
              <View style={styles.infoCard}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="bed-outline"
                    size={21}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.infoValue}>{house.rooms}</Text>
                <Text style={styles.infoLabel}>Pièce(s)</Text>
              </View>
            )}

            {house.surface != null && (
              <View style={styles.infoCard}>
                <View style={styles.infoIcon}>
                  <Ionicons
                    name="resize-outline"
                    size={21}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.infoValue}>{house.surface}</Text>
                <Text style={styles.infoLabel}>Surface (m²)</Text>
              </View>
            )}

            <View style={styles.infoCard}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="home-outline"
                  size={21}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.infoValue} numberOfLines={1}>
                {house.type || "Logement"}
              </Text>
              <Text style={styles.infoLabel}>Type</Text>
            </View>
          </View>

          {/* Description */}
          {!!house.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>À propos du logement</Text>
              <Text style={styles.description}>
                {house.description}
              </Text>
            </View>
          )}

          {/* Équipements */}
          {activeEquipments.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Équipements et services</Text>

              <View style={styles.equipmentGrid}>
                {activeEquipments.map(([key, label]) => (
                  <View key={key} style={styles.equipmentItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.success}
                    />
                    <Text style={styles.equipmentText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Annonceur */}
          {house.owner && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Votre annonceur</Text>

              <View style={styles.ownerCard}>
                <View style={styles.ownerAvatar}>
                  <Ionicons
                    name="person-outline"
                    size={25}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>
                    {house.owner.name || "Annonceur"}
                  </Text>
                  <Text style={styles.ownerRole}>
                    Propriétaire / Annonceur
                  </Text>
                </View>

                <View style={styles.ownerVerified}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={COLORS.success}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Barre d'action fixe */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>À partir de</Text>
          <Text style={styles.bottomPrice}>
            {formatPrice(house.price)}
          </Text>
          <Text style={styles.bottomCurrency}>FCFA / mois</Text>
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[
              styles.contactButton,
              contacting && styles.disabledButton,
            ]}
            onPress={handleContact}
            disabled={contacting}
            activeOpacity={0.8}
          >
            {contacting ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color={COLORS.primary}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reserveButton}
            onPress={handleReservation}
            activeOpacity={0.85}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.white}
            />
            <Text style={styles.reserveText}>Visiter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de réservation */}
      <VisitModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSendVisitRequest}
        propertyTitle={house.title || "Logement"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingBottom: 125,
  },

  center: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  loadingText: {
    marginTop: 14,
    color: COLORS.secondary,
    fontSize: 14,
  },

  errorIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  errorDescription: {
    color: COLORS.secondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },

  backButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 13,
    borderRadius: 12,
  },

  backButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },

  /* Galerie */

  gallery: {
    height: 330,
    width: "100%",
    backgroundColor: "#E2E8F0",
    position: "relative",
  },

  image: {
    width,
    height: 330,
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
  },

  noImageText: {
    marginTop: 10,
    color: COLORS.secondary,
    fontSize: 13,
  },

  headerButtons: {
    position: "absolute",
    top: 48,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  circleButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.96)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  imageCounter: {
    position: "absolute",
    right: 18,
    bottom: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },

  imageCounterText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  pagination: {
    position: "absolute",
    bottom: 22,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.55)",
    marginHorizontal: 3,
  },

  activeDot: {
    width: 21,
    backgroundColor: COLORS.white,
  },

  /* Contenu */

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },

  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,
  },

  title: {
    fontSize: 25,
    lineHeight: 33,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },

  location: {
    fontSize: 14,
    color: COLORS.secondary,
    flex: 1,
  },

  /* Prix */

  priceCard: {
    marginTop: 24,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  priceLabel: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: "600",
    marginBottom: 5,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  price: {
    fontSize: 26,
    color: COLORS.primary,
    fontWeight: "800",
  },

  currency: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "700",
  },

  priceIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Caractéristiques */

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 16,
  },

  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },

  infoCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 15,
    paddingHorizontal: 7,
    alignItems: "center",
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    maxWidth: "100%",
  },

  infoLabel: {
    fontSize: 11,
    color: COLORS.secondary,
    marginTop: 4,
    textAlign: "center",
  },

  /* Sections */

  section: {
    marginTop: 32,
  },

  description: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 25,
  },

  /* Équipements */

  equipmentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },

  equipmentText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },

  /* Annonceur */

  ownerCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  ownerInfo: {
    flex: 1,
    marginLeft: 13,
  },

  ownerName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },

  ownerRole: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
  },

  ownerVerified: {
    marginLeft: 8,
  },

  /* Barre inférieure */

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },

  bottomPriceContainer: {
    flex: 1,
  },

  bottomPriceLabel: {
    color: COLORS.secondary,
    fontSize: 11,
    marginBottom: 3,
  },

  bottomPrice: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
  },

  bottomCurrency: {
    color: COLORS.secondary,
    fontSize: 10,
    marginTop: 2,
  },

  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  contactButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  reserveButton: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  reserveText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },
});
