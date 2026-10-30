
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import HouseCard from "./HouseCard";
import { HOME_SECTION_LIMIT } from "../../constants/home";
import { isRecent } from "../../utils/dates";

const COLORS = {
  primary: "#2563EB",
  text: "#111827",
  secondary: "#6B7280",
  muted: "#9CA3AF",
};

export default function NewSection({ houses = [], onSeeAll }) {
  const safeHouses = Array.isArray(houses) ? houses : [];

  // Conserver uniquement les annonces récentes
  const newHouses = safeHouses.filter(
    (house) => house?.createdAt && isRecent(house.createdAt)
  );

  const visibleHouses = newHouses.slice(
    0,
    HOME_SECTION_LIMIT
  );

  // Ne pas afficher la section si aucune nouveauté
  if (visibleHouses.length === 0) return null;

  return (
    <View style={styles.section}>
      {/* EN-TÊTE */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="sparkles"
              size={21}
              color="#2563EB"
            />
          </View>

          <Text style={styles.title}>Nouveautés</Text>
        </View>

        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={onSeeAll}
          activeOpacity={0.7}
        >
          <Text style={styles.seeAllText}>Voir plus</Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* LISTE DES NOUVELLES ANNONCES */}
      <FlatList
        horizontal
        data={visibleHouses}
        keyExtractor={(item, index) =>
          String(item?.id ?? index)
        }
        renderItem={({ item }) => (
          <HouseCard
            house={item}
            variant="horizontal"
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={3}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={false}
      />

      {/* INDICATEUR */}
      <View style={styles.footer}>
        <View style={styles.footerIcon}>
          <Ionicons
            name="time-outline"
            size={14}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.footerText}>
          Annonces publiées récemment
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
    marginBottom: 8,
  },

  header: {
    paddingHorizontal: 20,
    marginBottom: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginLeft: 11,
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.4,
  },

  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingLeft: 10,
  },

  seeAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 5,
  },

  footerIcon: {
    width: 25,
    height: 25,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  footerText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 8,
  },
});
