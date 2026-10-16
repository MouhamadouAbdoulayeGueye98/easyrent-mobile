import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

import { getProperties } from "../../services/properties";

const INITIAL_REGION = {
  latitude: 14.7167,
  longitude: -17.4677,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

function hasValidCoordinates(property) {
  const latitude = Number(property.latitude);
  const longitude = Number(property.longitude);

  return (
    property.latitude != null &&
    property.longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function formatPrice(price) {
  if (price == null || price === "" || !Number.isFinite(Number(price))) {
    return "Prix non renseigné";
  }

  return `${Number(price).toLocaleString("fr-FR")} FCFA`;
}

export default function EasyRentMap() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  const locateMe = useCallback(async () => {
    try {
      setLocating(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Autorisation nécessaire",
          "Autorise l'accès à ta position dans les paramètres du téléphone.",
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserLocation(coords);

      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        },
        800,
      );
    } catch (err) {
      Alert.alert(
        "Localisation impossible",
        "Vérifie que le GPS est activé, puis réessaie.",
      );
    } finally {
      setLocating(false);
    }
  }, []);

  const openDirections = useCallback(
    async (property) => {
      if (!hasValidCoordinates(property)) {
        Alert.alert(
          "Position indisponible",
          "Ce logement ne possède pas de coordonnées GPS valides.",
        );
        return;
      }

      const destination = `${Number(property.latitude)},${Number(property.longitude)}`;

      const origin = userLocation
        ? `&origin=${userLocation.latitude},${userLocation.longitude}`
        : "";

      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${destination}` +
        origin +
        `&travelmode=driving`;

      try {
        await Linking.openURL(url);
      } catch {
        Alert.alert(
          "Navigation indisponible",
          "Impossible d'ouvrir l'application de navigation.",
        );
      }
    },
    [userLocation],
  );

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProperties();

      // Le backend renvoie normalement directement un tableau.
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];

      setProperties(list);
    } catch (err) {
      console.error(
        "Erreur chargement des logements sur la carte :",
        err.response?.data || err.message || err,
      );
      setError("Impossible de charger les logements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const locatedProperties = properties.filter(hasValidCoordinates);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsCompass
        showsUserLocation={Boolean(userLocation)}
        toolbarEnabled={false}
      >
        {locatedProperties.map((property) => (
          <Marker
            key={property.id}
            coordinate={{
              latitude: Number(property.latitude),
              longitude: Number(property.longitude),
            }}
            title={property.title || "Logement"}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>
                {property.price != null
                  ? Number(property.price).toLocaleString("fr-FR")
                  : "Prix N/D"}
              </Text>
              <Text style={styles.currency}>FCFA</Text>
            </View>

            <Callout
              onPress={() => {
                if (property.id) {
                  router.push(`/house/${property.id}`);
                }
              }}
            >
              <View style={styles.callout}>
                <Text style={styles.title}>
                  {property.title || "Logement sans titre"}
                </Text>

                <Text style={styles.price}>
                  {formatPrice(property.price)}
                  {property.listingType === "LOCATION" ? " / mois" : ""}
                </Text>

                <Text style={styles.city}>
                  {[property.quartier, property.city]
                    .filter(Boolean)
                    .join(", ") || "Adresse non renseignée"}
                </Text>

                <Text style={styles.openDetail}>Voir les détails ›</Text>

                <Pressable
                  onPress={() => openDirections(property)}
                  style={styles.directionsButton}
                >
                  <Text style={styles.directionsButtonText}>Itinéraire</Text>
                </Pressable>

                <Pressable
                  onPress={() => openDirections(property)}
                  style={styles.directionsButton}
                >
                  <Text style={styles.directionsButtonText}>Itinéraire</Text>
                </Pressable>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Pressable
        style={styles.locationButton}
        onPress={locateMe}
        disabled={locating}
      >
        {locating ? (
          <ActivityIndicator color="#2563EB" />
        ) : (
          <Text style={styles.locationButtonText}>📍 Ma position</Text>
        )}
      </Pressable>

      {loading && (
        <View style={styles.statusBox}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.statusText}>Chargement des logements...</Text>
        </View>
      )}

      {!loading && error !== "" && (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{error}</Text>
          <Pressable onPress={loadProperties} style={styles.retryButton}>
            <Text style={styles.retryText}>Réessayer</Text>
          </Pressable>
        </View>
      )}

      {!loading && !error && properties.length === 0 && (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            Aucune annonce disponible pour le moment.
          </Text>
        </View>
      )}

      {!loading &&
        !error &&
        properties.length > 0 &&
        locatedProperties.length === 0 && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              Les annonces existent, mais aucune ne possède de coordonnées GPS
              valides pour être affichée sur la carte.
            </Text>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 16,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  marker: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    elevation: 4,
  },
  markerText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  currency: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
  },
  callout: {
    width: 210,
    padding: 8,
  },
  title: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  price: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },
  city: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  openDetail: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
  },
  statusBox: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
    elevation: 4,
  },
  statusText: {
    color: "#374151",
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  locationButton: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  locationButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "700",
  },

  directionsButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  directionsButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
});
