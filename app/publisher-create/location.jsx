import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  Text,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";
import { useListing } from "../../context/ListingContext";

const DAKAR = {
  latitude: 14.7167,
  longitude: -17.4677,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function LocationScreen() {
  const { listing, updateListing } = useListing();

  const [mapRegion, setMapRegion] = useState(() => ({
    ...DAKAR,
    ...(listing.latitude != null && listing.longitude != null
      ? {
          latitude: listing.latitude,
          longitude: listing.longitude,
        }
      : {}),
  }));

  const [loadingGPS, setLoadingGPS] = useState(false);

  function handleChange(key, value) {
    updateListing({ [key]: value });
  }

  function selectPosition(coordinate) {
    const latitude = coordinate.latitude;
    const longitude = coordinate.longitude;

    updateListing({ latitude, longitude });

    setMapRegion((previous) => ({
      ...previous,
      latitude,
      longitude,
    }));
  }

  async function handleGPS() {
    try {
      setLoadingGPS(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Autorisation nécessaire",
          "Autorise l'accès à ta position pour localiser le logement.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      selectPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      Alert.alert(
        "Position récupérée",
        "La position GPS a été enregistrée. Vérifie qu'elle correspond bien au logement.",
      );
    } catch (error) {
      console.error("Erreur GPS :", error);

      Alert.alert(
        "Erreur GPS",
        "Impossible de récupérer la position. Vérifie les réglages de localisation de ton téléphone.",
      );
    } finally {
      setLoadingGPS(false);
    }
  }

  function handleNext() {
    if (!listing.region?.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir la région.");
      return;
    }

    if (!listing.city?.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir la ville.");
      return;
    }

    if (!listing.district?.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir le quartier.");
      return;
    }

    if (!listing.address?.trim()) {
      Alert.alert("Champ obligatoire", "Veuillez saisir l'adresse précise.");
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

      <FormSection title="Adresse du logement">
        <FormInput
          label="Région"
          placeholder="Ex : Dakar"
          placeholderTextColor="#9CA3AF"
          value={listing.region}
          onChangeText={(text) => handleChange("region", text)}
        />

        <FormInput
          label="Ville"
          placeholder="Ex : Dakar"
          placeholderTextColor="#9CA3AF"
          value={listing.city}
          onChangeText={(text) => handleChange("city", text)}
        />

        <FormInput
          label="Quartier"
          placeholder="Ex : Almadies"
          placeholderTextColor="#9CA3AF"
          value={listing.district}
          onChangeText={(text) => handleChange("district", text)}
        />

        <FormInput
          label="Adresse précise"
          placeholder="Rue, numéro..."
          placeholderTextColor="#9CA3AF"
          value={listing.address}
          onChangeText={(text) => handleChange("address", text)}
        />
      </FormSection>

      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Localiser le logement</Text>

        <Text style={styles.description}>
          Utilise le GPS ou touche la carte pour placer le repère à
          l'emplacement du logement. Tu peux aussi déplacer le repère.
        </Text>

        <Pressable
          style={[styles.gpsButton, loadingGPS && styles.disabledButton]}
          onPress={handleGPS}
          disabled={loadingGPS}
        >
          <Text style={styles.gpsButtonText}>
            {loadingGPS
              ? "Récupération de la position..."
              : "Utiliser ma position GPS"}
          </Text>
        </Pressable>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={mapRegion}
            onPress={(event) => selectPosition(event.nativeEvent.coordinate)}
            onRegionChangeComplete={(region) =>
              setMapRegion((previous) => ({
                ...previous,
                latitudeDelta: region.latitudeDelta,
                longitudeDelta: region.longitudeDelta,
              }))
            }
          >
            {listing.latitude != null && listing.longitude != null && (
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
        </View>

        {listing.latitude != null && listing.longitude != null && (
          <View style={styles.coordinates}>
            <Text style={styles.coordinatesTitle}>Position sélectionnée</Text>
            <Text style={styles.coordinatesText}>
              Latitude : {listing.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              Longitude : {listing.longitude.toFixed(6)}
            </Text>
          </View>
        )}

        <Text style={styles.hint}>
          La carte démarre sur Dakar si aucune position n'est encore
          enregistrée. Vérifie toujours que le repère correspond au logement, et
          non à ta position actuelle.
        </Text>
      </View>

      <FormButton title="Suivant" onPress={handleNext} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  locationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  gpsButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  gpsButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  mapContainer: {
    height: 300,
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  map: {
    flex: 1,
  },
  coordinates: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
  },
  coordinatesTitle: {
    color: "#1D4ED8",
    fontWeight: "700",
    marginBottom: 6,
  },
  coordinatesText: {
    color: "#334155",
    fontSize: 13,
    marginTop: 3,
  },
  hint: {
    marginTop: 12,
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },
});
