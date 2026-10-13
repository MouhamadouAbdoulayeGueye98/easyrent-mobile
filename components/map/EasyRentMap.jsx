
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

const INITIAL_REGION = {
  latitude: 14.7167,
  longitude: -17.4677,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

// Données temporaires pour tester la carte.
// Nous les remplacerons ensuite par les annonces du backend.
const DEMO_PROPERTIES = [
  {
    id: "demo-1",
    title: "Appartement aux Almadies",
    price: 250000,
    city: "Dakar",
    latitude: 14.744,
    longitude: -17.513,
  },
  {
    id: "demo-2",
    title: "Studio au Plateau",
    price: 150000,
    city: "Dakar",
    latitude: 14.668,
    longitude: -17.433,
  },
  {
    id: "demo-3",
    title: "Appartement à Mermoz",
    price: 200000,
    city: "Dakar",
    latitude: 14.706,
    longitude: -17.481,
  },
];

export default function EasyRentMap() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsCompass
        toolbarEnabled={false}
      >
        {DEMO_PROPERTIES.map((property) => (
          <Marker
            key={property.id}
            coordinate={{
              latitude: property.latitude,
              longitude: property.longitude,
            }}
            title={property.title}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>
                {property.price.toLocaleString("fr-FR")}
              </Text>
              <Text style={styles.currency}>FCFA</Text>
            </View>

            <Callout>
              <View style={styles.callout}>
                <Text style={styles.title}>{property.title}</Text>
                <Text style={styles.price}>
                  {property.price.toLocaleString("fr-FR")} FCFA / mois
                </Text>
                <Text style={styles.city}>{property.city}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
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
    width: 190,
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
});
