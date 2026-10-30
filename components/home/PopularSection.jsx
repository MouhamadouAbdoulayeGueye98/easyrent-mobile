
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

const COLORS = {
  primary: "#2563EB",
  text: "#111827",
  secondary: "#6B7280",
  muted: "#9CA3AF",
  background: "#EFF6FF",
};

export default function PopularSection({ houses = [], onSeeAll }) {
  const safeHouses = Array.isArray(houses) ? houses : [];

  const visibleHouses = safeHouses.slice(
    0,
    HOME_SECTION_LIMIT
  );

  return (
    <View style={styles.section}>
      {/* EN-TÊTE */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="flame"
              size={21}
              color="#F97316"
            />
          </View>

          <Text style={styles.title}>Populaires</Text>
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

      {/* LISTE DES LOGEMENTS */}
      {visibleHouses.length > 0 ? (
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
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="home-outline"
              size={28}
              color={COLORS.muted}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Aucun logement populaire
          </Text>

          <Text style={styles.emptyDescription}>
            Les logements populaires apparaîtront ici.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
    marginBottom: 10,
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
    backgroundColor: "#FFF7ED",
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
    paddingBottom: 12,
  },

  emptyContainer: {
    marginHorizontal: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  emptyIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyDescription: {
    color: COLORS.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
});
