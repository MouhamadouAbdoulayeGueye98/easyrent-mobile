import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useToast } from "../../context/ToastContext";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

const TOTAL_STEPS = 7;
const CURRENT_STEP = 2;

const COLORS = {
  primary: "#2563EB",
  primarySoft: "#EFF4FF",
  background: "#F5F7FB",
  surface: "#FFFFFF",
  border: "#E4E8F0",
  text: "#0F172A",
  muted: "#64748B",
};

const DAKAR = {
  latitude: 14.7167,
  longitude: -17.4677,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
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
            style={[styles.segment, index < CURRENT_STEP && styles.segmentDone]}
          />
        ))}
      </View>
    </View>
  );
}

export default function LocationScreen() {
  const { listing, updateListing } = useListing();
  const mapRef = useRef(null);
  const [mapType, setMapType] = useState("standard");
  const [loadingGPS, setLoadingGPS] = useState(false);
  const { showToast } = useToast();

  // Région de départ de la carte (lue une seule fois)
  const [initialRegion] = useState(() => ({
    ...DAKAR,
    ...(listing.latitude != null && listing.longitude != null
      ? {
          latitude: listing.latitude,
          longitude: listing.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
      : {}),
  }));

  const hasPosition = listing.latitude != null && listing.longitude != null;

  function handleChange(key, value) {
    updateListing({ [key]: value });
  }

  function selectPosition(coordinate) {
    const latitude = coordinate.latitude;
    const longitude = coordinate.longitude;

    updateListing({ latitude, longitude });
  }

  async function handleGPS() {
    try {
      setLoadingGPS(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        showToast(
          "Autorise l'accès à ta position dans les réglages pour utiliser le GPS.",
          "error",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coordinate = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      selectPosition(coordinate);

      // Recentre la carte sur la position récupérée
      mapRef.current?.animateToRegion(
        {
          ...coordinate,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );

      showToast(
        "Position GPS récupérée. Vérifie qu'elle correspond bien au logement.",
        "success",
      );
    } catch (error) {
      console.error("Erreur GPS :", error);

      showToast(
        "Impossible de récupérer la position. Vérifie les réglages de localisation de ton téléphone.",
        "error",
      );
    } finally {
      setLoadingGPS(false);
    }
  }

  function handleNext() {
    if (!listing.region?.trim()) {
      showToast("Veuillez saisir la région.", "error");
      return;
    }

    if (!listing.city?.trim()) {
      showToast("Veuillez saisir la ville.", "error");
      return;
    }

    if (!listing.district?.trim()) {
      showToast("Veuillez saisir le quartier.", "error");
      return;
    }

    if (!listing.address?.trim()) {
      showToast("Veuillez saisir l'adresse précise.", "error");
      return;
    }

    console.log("Étape localisation validée :", listing);

    router.push("/publisher-create/features");
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Header title="Localisation" showBack />

      <ProgressSteps hint="Localisation" />

      <FormSection title="Adresse du logement">
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
            <FormInput
              label="Région"
              placeholder="Ex : Dakar"
              placeholderTextColor="#94A3B8"
              value={listing.region}
              onChangeText={(text) => handleChange("region", text)}
            />
          </View>

          <View style={styles.inputHalf}>
            <FormInput
              label="Ville"
              placeholder="Ex : Dakar"
              placeholderTextColor="#94A3B8"
              value={listing.city}
              onChangeText={(text) => handleChange("city", text)}
            />
          </View>
        </View>

        <FormInput
          label="Quartier"
          placeholder="Ex : Almadies"
          placeholderTextColor="#94A3B8"
          value={listing.district}
          onChangeText={(text) => handleChange("district", text)}
        />

        <FormInput
          label="Adresse précise"
          placeholder="Rue, numéro..."
          placeholderTextColor="#94A3B8"
          value={listing.address}
          onChangeText={(text) => handleChange("address", text)}
        />
      </FormSection>

      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Localiser le logement</Text>

        <Text style={styles.description}>
          Utilise le GPS ou touche la carte pour placer le repère. Tu peux
          ensuite le déplacer.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.gpsButton,
            pressed && styles.gpsButtonPressed,
            loadingGPS && styles.disabledButton,
          ]}
          onPress={handleGPS}
          disabled={loadingGPS}
          accessibilityRole="button"
        >
          {loadingGPS ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="locate" size={20} color={COLORS.primary} />
          )}

          <Text style={styles.gpsButtonText}>
            {loadingGPS
              ? "Récupération de la position..."
              : "Utiliser ma position GPS"}
          </Text>
        </Pressable>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            mapType={mapType}
            onPress={(event) => selectPosition(event.nativeEvent.coordinate)}
          >
            {hasPosition && (
              <Marker
                coordinate={{
                  latitude: listing.latitude,
                  longitude: listing.longitude,
                }}
                draggable
                title="Logement"
                description="Déplace ce repère si nécessaire"
                onDragEnd={(event) =>
                  selectPosition(event.nativeEvent.coordinate)
                }
              />
            )}
          </MapView>

          {/* Bouton vue normale / satellite */}
          <Pressable
            style={styles.mapToggle}
            onPress={() =>
              setMapType((current) =>
                current === "satellite" ? "standard" : "satellite",
              )
            }
            accessibilityRole="button"
            accessibilityLabel={
              mapType === "satellite"
                ? "Passer en vue normale"
                : "Passer en vue satellite"
            }
          >
            <Ionicons
              name={mapType === "satellite" ? "map-outline" : "earth-outline"}
              size={18}
              color={COLORS.text}
            />
            <Text style={styles.mapToggleText}>
              {mapType === "satellite" ? "Plan" : "Satellite"}
            </Text>
          </Pressable>

          {/* Invitation tant qu'aucune position n'est choisie */}
          {!hasPosition && (
            <View style={styles.mapPrompt} pointerEvents="none">
              <Ionicons name="hand-left-outline" size={16} color="#FFFFFF" />
              <Text style={styles.mapPromptText}>
                Touche la carte pour placer le repère
              </Text>
            </View>
          )}
        </View>

        {hasPosition ? (
          <View style={styles.coordinates}>
            <View style={styles.coordinatesIcon}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
            </View>

            <View style={styles.coordinatesBody}>
              <Text style={styles.coordinatesTitle}>Position sélectionnée</Text>
              <Text style={styles.coordinatesText}>
                {listing.latitude.toFixed(6)}, {listing.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.hint}>
            La carte démarre sur Dakar tant qu'aucune position n'est
            enregistrée.
          </Text>
        )}

        <Text style={styles.hint}>
          Vérifie que le repère correspond au logement, et non à ta position
          actuelle.
        </Text>
      </View>

      <FormButton title="Suivant" onPress={handleNext} />
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: { elevation: 3 },
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
    marginBottom: 28,
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

  /* Formulaire */
  inputRow: {
    flexDirection: "row",
    gap: 12,
  },

  inputHalf: {
    flex: 1,
  },

  /* Carte */
  locationSection: {
    marginTop: 8,
    marginBottom: 24,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },

  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    marginBottom: 14,
  },

  gpsButtonPressed: {
    opacity: 0.75,
  },

  disabledButton: {
    opacity: 0.6,
  },

  gpsButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  mapContainer: {
    height: 300,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...cardShadow,
  },

  map: {
    flex: 1,
  },

  mapToggle: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    ...cardShadow,
  },

  mapToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
  },

  mapPrompt: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(15,23,42,0.82)",
  },

  mapPromptText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },

  coordinates: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D6E4FF",
    backgroundColor: COLORS.primarySoft,
  },

  coordinatesIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  coordinatesBody: {
    flex: 1,
  },

  coordinatesTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },

  coordinatesText: {
    color: "#334155",
    fontSize: 13,
    marginTop: 2,
  },

  hint: {
    marginTop: 12,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },
});
