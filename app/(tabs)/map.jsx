import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EasyRentMap from "../../components/map/EasyRentMap";

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorer la carte</Text>
        <Text style={styles.subtitle}>
          Trouve un logement près de l'endroit qui te convient.
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <EasyRentMap />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
  },
  mapContainer: {
  flex: 1,
  minHeight: 300,
  marginHorizontal: 16,
  marginBottom: 12,
  borderRadius: 16,
  overflow: "hidden",
  backgroundColor: "#D1D5DB",
},
});
