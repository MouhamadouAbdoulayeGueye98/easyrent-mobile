import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useState } from "react";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

import {
  createProperty,
  uploadPropertyPhoto,
} from "../../services/propertyService";

const TOTAL_STEPS = 7;
const CURRENT_STEP = 7;
const MAX_PHOTOS = 10;

const COLORS = {
  primary: "#2563EB",
  primarySoft: "#EFF4FF",
  background: "#F5F7FB",
  surface: "#FFFFFF",
  border: "#E4E8F0",
  text: "#0F172A",
  muted: "#64748B",
  danger: "#DC2626",
};

function ProgressSteps({ hint }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressText}>
          Étape {CURRENT_STEP} sur {TOTAL_STEPS}
        </Text>
        <Text style={styles.progressHint}>{hint}</Text>
      </View>

      <View style={styles.segments}>
        {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.segment,
              index < CURRENT_STEP && styles.segmentDone,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

export default function Photos() {
  const { listing, resetListing } = useListing();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(0);

  async function pickImages() {
    const remaining = MAX_PHOTOS - images.length;

    if (remaining <= 0) {
      Alert.alert(
        "Limite atteinte",
        `Tu peux ajouter ${MAX_PHOTOS} photos au maximum.`,
      );
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission refusée",
        "La permission est nécessaire pour choisir des images.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.7,
    });

    if (!result.canceled) {
      // Les nouvelles photos s'ajoutent aux précédentes (sans doublons)
      setImages((prev) => {
        const known = new Set(prev.map((item) => item.uri));
        const fresh = result.assets.filter((item) => !known.has(item.uri));
        return [...prev, ...fresh].slice(0, MAX_PHOTOS);
      });
    }
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handlePublish() {
    try {
      setLoading(true);

      // Vérifications
      if (!listing.title || !listing.description) {
        Alert.alert(
          "Informations manquantes",
          "Veuillez compléter les informations générales.",
        );
        return;
      }

      if (!listing.city || !listing.address) {
        Alert.alert(
          "Localisation manquante",
          "Veuillez compléter la localisation.",
        );
        return;
      }

      if (!listing.price) {
        Alert.alert(
          "Prix manquant",
          "Veuillez renseigner le prix du logement.",
        );
        return;
      }

      if (!listing.propertyType) {
        Alert.alert("Type manquant", "Veuillez choisir le type de logement.");
        return;
      }

      // 1. Création de l'annonce

      const property = await createProperty({
        title: listing.title,
        description: listing.description,

        region: listing.region || undefined,
        address: listing.address,
        city: listing.city,
        quartier: listing.district || undefined,

        // Coordonnées GPS du logement
        latitude:
          listing.latitude != null ? Number(listing.latitude) : undefined,
        longitude:
          listing.longitude != null ? Number(listing.longitude) : undefined,

        type: listing.propertyType,
        listingType: listing.listingType || undefined,

        price: Number(listing.price),

        surface: listing.area ? Number(listing.area) : undefined,

        rooms: Number(listing.bedrooms),
        bathrooms: Number(listing.bathrooms),

        charges: listing.charges ? Number(listing.charges) : undefined,

        deposit: listing.deposit ? Number(listing.deposit) : undefined,

        availability: listing.availability || undefined,
        furnished: listing.furnished,
      });

      console.log("Annonce créée :", property);

      // 2. Upload des photos
      for (let i = 0; i < images.length; i++) {
        setUploadIndex(i + 1);
        await uploadPropertyPhoto(property.id, images[i]);
      }

      console.log("Toutes les photos ont été envoyées.");

      // 3. Réinitialiser le formulaire
      resetListing();
      setImages([]);

      // 4. Message puis retour dashboard
      Alert.alert("Annonce publiée", "Votre logement a été créé avec succès.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/publisher");
          },
        },
      ]);
    } catch (error) {
      console.error("Erreur création annonce :", error.response?.data || error);

      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Impossible de publier l'annonce.",
      );
    } finally {
      setLoading(false);
      setUploadIndex(0);
    }
  }

  const place = [listing.district, listing.city].filter(Boolean).join(", ");

  const buttonTitle = !loading
    ? "Publier l'annonce"
    : uploadIndex > 0
      ? `Envoi des photos ${uploadIndex} sur ${images.length}...`
      : "Publication...";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Header title="Photos du logement" showBack />

      <ProgressSteps hint="Photos" />

      {/* Récapitulatif de l'annonce */}
      {!!listing.title && (
        <View style={styles.recap}>
          <View style={styles.recapIcon}>
            <Ionicons name="home" size={20} color={COLORS.primary} />
          </View>

          <View style={styles.recapBody}>
            <Text style={styles.recapTitle} numberOfLines={1}>
              {listing.title}
            </Text>
            {!!place && (
              <Text style={styles.recapSub} numberOfLines={1}>
                {place}
              </Text>
            )}
          </View>
        </View>
      )}

      <FormSection title="Ajouter des photos">
        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabled]}
          onPress={pickImages}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Ajouter des photos"
        >
          <View style={styles.addIcon}>
            <Ionicons name="images-outline" size={26} color={COLORS.primary} />
          </View>

          <Text style={styles.addText}>
            {images.length === 0 ? "Ajouter des photos" : "Ajouter d'autres photos"}
          </Text>

          <Text style={styles.addHint}>
            {images.length === 0
              ? `Jusqu'à ${MAX_PHOTOS} photos. La première sera la photo principale.`
              : `${images.length} sur ${MAX_PHOTOS} photos`}
          </Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <View style={styles.gallery}>
            {images.map((image, index) => (
              <View key={image.uri} style={styles.thumb}>
                <Image source={{ uri: image.uri }} style={styles.image} />

                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverText}>Principale</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                  disabled={loading}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={`Supprimer la photo ${index + 1}`}
                >
                  <Ionicons name="close" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {images.length === 0 && (
          <Text style={styles.emptyNote}>
            Ajoute au moins une photo pour présenter ton logement.
          </Text>
        )}
      </FormSection>

      <FormButton
        title={buttonTitle}
        onPress={handlePublish}
        disabled={loading}
      />
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  android: { elevation: 2 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Progression */
  progressContainer: {
    marginBottom: 24,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },

  progressText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },

  progressHint: {
    fontSize: 13,
    color: COLORS.muted,
  },

  segments: {
    flexDirection: "row",
    gap: 6,
  },

  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },

  segmentDone: {
    backgroundColor: COLORS.primary,
  },

  /* Récapitulatif */
  recap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...cardShadow,
  },

  recapIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  recapBody: {
    flex: 1,
  },

  recapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  recapSub: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },

  /* Zone d'ajout */
  addButton: {
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    borderRadius: 18,
    backgroundColor: COLORS.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },

  disabled: {
    opacity: 0.5,
  },

  addIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  addText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  addHint: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },

  /* Galerie */
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
    gap: 8,
  },

  thumb: {
    width: "31%",
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.border,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  coverBadge: {
    position: "absolute",
    left: 6,
    bottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(15,23,42,0.75)",
  },

  coverText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyNote: {
    marginTop: 14,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
  },
});
