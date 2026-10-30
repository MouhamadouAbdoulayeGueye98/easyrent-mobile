import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

import { useToast } from "../../context/ToastContext";
import { getProperties } from "../../services/properties";

const INITIAL_REGION = {
  latitude: 14.7167,
  longitude: -17.4677,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

const PROPERTY_TYPES = [
  { label: "Tous", value: "TOUS" },
  { label: "Appartement", value: "APPARTEMENT" },
  { label: "Studio", value: "STUDIO" },
  { label: "Chambre", value: "CHAMBRE" },
  { label: "Colocation", value: "COLOCATION" },
];

const LISTING_TYPES = [
  { label: "Tout", value: "TOUS" },
  { label: "Location", value: "LOCATION" },
  { label: "Vente", value: "VENTE" },
];

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

function getPropertyType(property) {
  return property.type ?? property.propertyType ?? "";
}

function getDistrict(property) {
  return property.quartier ?? property.district ?? property.neighborhood ?? "";
}

function getPhoto(property) {
  const photo = property.photos?.[0];

  if (typeof photo === "string") {
    return photo;
  }

  return photo?.url ?? photo?.uri ?? null;
}

function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function EasyRentMap() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("TOUS");
  const [selectedListing, setSelectedListing] = useState("TOUS");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [panelExpanded, setPanelExpanded] = useState(false);

  const mapRef = useRef(null);

  const panelPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 10 &&
        Math.abs(gesture.dy) > Math.abs(gesture.dx),

      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -30) {
          setPanelExpanded(true);
        } else if (gesture.dy > 30) {
          setPanelExpanded(false);
        }
      },
    }),
  ).current;

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProperties();

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

  const locateMe = useCallback(async () => {
    try {
      setLocating(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        showToast(
          "Autorise l'accès à ta position dans les paramètres du téléphone.",
          "error",
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

      showToast("Ta position a été récupérée.", "success");
    } catch (error) {
      console.error("Erreur de géolocalisation :", error);

      showToast(
        "Localisation impossible. Vérifie que le GPS est activé, puis réessaie.",
        "error",
      );
    } finally {
      setLocating(false);
    }
  }, [showToast]);

  const openDirections = useCallback(
    async (property) => {
      if (!hasValidCoordinates(property)) {
        showToast(
          "Ce logement ne possède pas de coordonnées GPS valides.",
          "error",
        );
        return;
      }

      const destination = `${Number(property.latitude)},${Number(property.longitude)}`;

      const origin = userLocation
        ? `&origin=${userLocation.latitude},${userLocation.longitude}`
        : "";

      const url =
        "https://www.google.com/maps/dir/?api=1" +
        `&destination=${destination}` +
        origin +
        "&travelmode=driving";

      try {
        await Linking.openURL(url);
      } catch (error) {
        console.error("Erreur ouverture navigation :", error);

        showToast("Impossible d'ouvrir l'application de navigation.", "error");
      }
    },
    [userLocation, showToast],
  );

  const resetFilters = () => {
    setSelectedType("TOUS");
    setSelectedListing("TOUS");
    setMinPrice("");
    setMaxPrice("");
  };

  const locatedProperties = properties.filter(hasValidCoordinates);

  const filteredProperties = locatedProperties.filter((property) => {
    const price = Number(property.price);
    const hasPrice =
      property.price != null && property.price !== "" && Number.isFinite(price);

    if (selectedType !== "TOUS" && getPropertyType(property) !== selectedType) {
      return false;
    }

    if (
      selectedListing !== "TOUS" &&
      property.listingType !== selectedListing
    ) {
      return false;
    }

    if (minPrice.trim() !== "") {
      const min = Number(minPrice);

      if (!Number.isFinite(min) || !hasPrice || price < min) {
        return false;
      }
    }

    if (maxPrice.trim() !== "") {
      const max = Number(maxPrice);

      if (!Number.isFinite(max) || !hasPrice || price > max) {
        return false;
      }
    }

    return true;
  });

  const openProperty = (property) => {
    if (property.id) {
      router.push(`/house/${property.id}`);
    }
  };

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
        {filteredProperties.map((property) => (
          <Marker
            key={String(property.id)}
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

            <Callout onPress={() => openProperty(property)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>
                  {property.title || "Logement sans titre"}
                </Text>

                <Text style={styles.calloutPrice}>
                  {formatPrice(property.price)}
                  {property.listingType === "LOCATION" ? " / mois" : ""}
                </Text>

                <Text style={styles.calloutAddress}>
                  {[getDistrict(property), property.city]
                    .filter(Boolean)
                    .join(", ") || "Adresse non renseignée"}
                </Text>

                <Text style={styles.calloutAction}>Voir les détails ›</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Compteur de résultats */}
      <View style={styles.resultsBadge}>
        <Text style={styles.resultsText}>
          {filteredProperties.length} logement
          {filteredProperties.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Accès permanent à la localisation */}
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

      {/* Ouverture des filtres */}
      <Pressable
        style={styles.filterToggle}
        onPress={() => setFiltersVisible((visible) => !visible)}
      >
        <Text style={styles.filterToggleText}>
          {filtersVisible ? "✕ Fermer les filtres" : "☷ Filtrer"}
        </Text>
      </Pressable>

      {filtersVisible && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>Type de transaction</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {LISTING_TYPES.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                selected={selectedListing === item.value}
                onPress={() => setSelectedListing(item.value)}
              />
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Type de logement</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {PROPERTY_TYPES.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                selected={selectedType === item.value}
                onPress={() => setSelectedType(item.value)}
              />
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Budget en FCFA</Text>

          <View style={styles.priceInputs}>
            <TextInput
              style={styles.priceInput}
              value={minPrice}
              onChangeText={setMinPrice}
              placeholder="Prix minimum"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />

            <TextInput
              style={styles.priceInput}
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholder="Prix maximum"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <Pressable style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetButtonText}>
              Réinitialiser les filtres
            </Text>
          </Pressable>
        </View>
      )}

      {/* Messages de chargement et d'erreur */}
      {loading && (
        <View style={styles.statusBox}>
          <ActivityIndicator color="#2563EB" />
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

      {!loading &&
        !error &&
        locatedProperties.length > 0 &&
        filteredProperties.length === 0 && (
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              Aucun logement ne correspond à ces filtres.
            </Text>

            <Pressable onPress={resetFilters} style={styles.retryButton}>
              <Text style={styles.retryText}>Effacer les filtres</Text>
            </Pressable>
          </View>
        )}

      {/* Panneau de logements repliable et déplaçable */}
      {!loading && !error && filteredProperties.length > 0 && (
        <View
          style={[
            styles.bottomSheet,
            panelExpanded && styles.bottomSheetExpanded,
          ]}
        >
          <View
            {...panelPanResponder.panHandlers}
            style={styles.sheetHandleArea}
          >
            <View style={styles.sheetHandle} />

            <Pressable
              onPress={() => setPanelExpanded((expanded) => !expanded)}
              style={styles.sheetHeading}
            >
              <View>
                <Text style={styles.sheetTitle}>Logements à découvrir</Text>
                <Text style={styles.sheetSubtitle}>
                  {filteredProperties.length} résultat
                  {filteredProperties.length !== 1 ? "s" : ""} · Glisse pour{" "}
                  {panelExpanded ? "réduire" : "agrandir"}
                </Text>
              </View>

              <Text style={styles.sheetChevron}>
                {panelExpanded ? "⌄" : "⌃"}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.propertyList}
          >
            {filteredProperties.map((property) => {
              const photo = getPhoto(property);

              return (
                <Pressable
                  key={String(property.id)}
                  style={styles.propertyCard}
                  onPress={() => openProperty(property)}
                >
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      style={styles.propertyImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>🏠</Text>
                    </View>
                  )}

                  <View style={styles.propertyCardBody}>
                    <Text style={styles.propertyTitle} numberOfLines={1}>
                      {property.title || "Logement sans titre"}
                    </Text>

                    <Text style={styles.propertyPrice} numberOfLines={1}>
                      {formatPrice(property.price)}
                    </Text>

                    <Text style={styles.propertyAddress} numberOfLines={1}>
                      {[getDistrict(property), property.city]
                        .filter(Boolean)
                        .join(", ") || "Adresse non renseignée"}
                    </Text>

                    <Text style={styles.propertyType}>
                      {property.listingType === "LOCATION"
                        ? "Location"
                        : property.listingType === "VENTE"
                          ? "Vente"
                          : "Annonce"}
                      {" · "}
                      {PROPERTY_TYPES.find(
                        (item) => item.value === getPropertyType(property),
                      )?.label || "Logement"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
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
    backgroundColor: "#F8FAFC",
  },
  map: {
    flex: 1,
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
  calloutTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },
  calloutPrice: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },
  calloutAddress: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  calloutAction: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 10,
  },
  resultsBadge: {
    position: "absolute",
    top: 14,
    left: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  resultsText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
  },
  locationButton: {
    position: "absolute",
    top: 14,
    right: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  locationButtonText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "700",
  },
  filterToggle: {
    position: "absolute",
    top: 64,
    right: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    elevation: 4,
  },
  filterToggleText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "700",
  },
  filtersPanel: {
    position: "absolute",
    top: 108,
    left: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    elevation: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  filterLabel: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 4,
  },
  chipRow: {
    gap: 7,
    paddingBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#D7DFEA",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  chipSelected: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  chipText: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  priceInputs: {
    flexDirection: "row",
    gap: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D7DFEA",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: "#111827",
    fontSize: 12,
    backgroundColor: "#FFFFFF",
  },
  resetButton: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  resetButtonText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
  },
  statusBox: {
    position: "absolute",
    top: 115,
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
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 142,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  bottomSheetExpanded: {
    height: 300,
  },
  sheetHandleArea: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#CBD5E1",
    marginBottom: 8,
  },
  sheetHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  sheetTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
  sheetSubtitle: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 3,
  },
  sheetChevron: {
    color: "#2563EB",
    fontSize: 23,
    fontWeight: "700",
    paddingHorizontal: 8,
  },
  propertyList: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 10,
  },
  propertyCard: {
    width: 205,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  propertyImage: {
    width: "100%",
    height: 74,
    backgroundColor: "#E2E8F0",
  },
  imagePlaceholder: {
    width: "100%",
    height: 74,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 28,
  },
  propertyCardBody: {
    padding: 9,
  },
  propertyTitle: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "700",
  },
  propertyPrice: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  propertyAddress: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 3,
  },
  propertyType: {
    color: "#475569",
    fontSize: 10,
    marginTop: 4,
  },
});
