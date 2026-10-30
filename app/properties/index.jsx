
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";


import Pagination from "../../components/common/Pagination";
import HouseCard from "../../components/home/HouseCard";
import PropertyFilterModal from "../../components/properties/PropertyFilterModal";
import { getPropertiesPage } from "../../services/properties";

const PAGE_SIZE = 5;

const COLORS = {
  primary: "#2563EB",
  primaryLight: "#EFF6FF",
  background: "#F8FAFC",
  white: "#FFFFFF",
  title: "#0F172A",
  text: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  danger: "#DC2626",
};

const PROPERTY_TYPES = [
  { label: "Tous", value: "TOUS" },
  { label: "Appartement", value: "APPARTEMENT" },
  // { label: "Maison", value: "MAISON" },
  { label: "Studio", value: "STUDIO" },
  { label: "Chambre", value: "CHAMBRE" },
];

function firstParam(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default function PropertiesList() {
  const params = useLocalSearchParams();

  const section = firstParam(params.section);
  const initialSearch = firstParam(params.search).trim();
  const routeType = firstParam(params.type);

  const isNew = section === "new";

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState(initialSearch);

  const [selectedType, setSelectedType] = useState(
    routeType || "TOUS"
  );

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [filtersVisible, setFiltersVisible] = useState(false);

  const [result, setResult] = useState({
    data: [],
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeFiltersCount =
    (selectedType !== "TOUS" ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  // Chargement des annonces
  useEffect(() => {
    let isActive = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getPropertiesPage({
          page,
          limit: PAGE_SIZE,

          ...(isNew ? { recent: true } : {}),
          ...(search ? { search } : {}),
          ...(selectedType !== "TOUS"
            ? { type: selectedType }
            : {}),
          ...(minPrice ? { minPrice } : {}),
          ...(maxPrice ? { maxPrice } : {}),
        });

        if (isActive) {
          setResult(data);
        }
      } catch (loadError) {
        console.error("Erreur chargement annonces :", loadError);

        if (isActive) {
          setError("Impossible de charger les annonces.");
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
  }, [page, isNew, search, selectedType, minPrice, maxPrice]);

  // Appliquer les filtres
  const handleApplyFilters = ({
    type,
    minPrice: nextMin,
    maxPrice: nextMax,
  }) => {
    setSelectedType(type);
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    setPage(1);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedType("TOUS");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    setPage(1);
    Keyboard.dismiss();
  };

  // Recherche
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const totalPages = result.totalPages || 1;

  const sectionTitle = isNew
    ? "Nouveautés"
    : "Tous les logements";

  const sectionSubtitle = isNew
    ? "Découvrez les dernières annonces publiées."
    : "Trouvez le logement qui vous correspond.";

  return (
    <View style={styles.container}>

      <FlatList
        data={loading || error ? [] : result.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HouseCard house={item} variant="large" />
        )}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.list,
          (!loading && !error && result.data.length === 0) &&
            styles.emptyList,
        ]}
        ListHeaderComponent={
          <View>
            {/* Introduction */}
            <View style={styles.intro}>
              <View style={styles.introText}>
                <Text style={styles.heading}>
                  Trouvez votre futur chez-vous
                </Text>

                <Text style={styles.subtitle}>
                  {sectionSubtitle}
                </Text>
              </View>

              <View style={styles.homeIcon}>
                <Ionicons
                  name="home-outline"
                  size={25}
                  color={COLORS.primary}
                />
              </View>
            </View>

            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={21}
                color={COLORS.muted}
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Ville, quartier, logement..."
                placeholderTextColor={COLORS.muted}
                value={search}
                onChangeText={handleSearch}
                returnKeyType="search"
                autoCorrect={false}
              />

              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => handleSearch("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={COLORS.muted}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Filtres rapides */}
            <View style={styles.filterHeader}>
              <Text style={styles.sectionTitle}>
                Type de logement
              </Text>

              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setFiltersVisible(true)}
              >
                <Ionicons
                  name="options-outline"
                  size={18}
                  color={COLORS.primary}
                />

                <Text style={styles.filterButtonText}>
                  Filtres
                </Text>

                {activeFiltersCount > 0 && (
                  <View style={styles.filterCount}>
                    <Text style={styles.filterCountText}>
                      {activeFiltersCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <FlatList
              data={PROPERTY_TYPES}
              horizontal
              keyExtractor={(item) => item.value}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typeList}
              renderItem={({ item }) => {
                const active = selectedType === item.value;

                return (
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      active && styles.typeButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedType(item.value);
                      setPage(1);
                    }}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        active && styles.typeTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {/* Résultats */}
            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  {isNew ? "Dernières annonces" : "Logements disponibles"}
                </Text>

                {!loading && !error && (
                  <Text style={styles.resultsCount}>
                    {result.total} logement(s) trouvé(s)
                  </Text>
                )}
              </View>

              {activeFiltersCount > 0 && (
                <TouchableOpacity
                  onPress={handleResetFilters}
                >
                  <Text style={styles.resetText}>
                    Réinitialiser
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
              />

              <Text style={styles.stateText}>
                Chargement des logements...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.stateContainer}>
              <View style={styles.stateIcon}>
                <Ionicons
                  name="cloud-offline-outline"
                  size={34}
                  color={COLORS.danger}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Oups ! Une erreur est survenue
              </Text>

              <Text style={styles.stateText}>
                {error}
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => setPage((current) => current)}
              >
                <Text style={styles.retryText}>
                  Réessayer
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.stateContainer}>
              <View style={styles.stateIcon}>
                <Ionicons
                  name="search-outline"
                  size={36}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Aucun logement trouvé
              </Text>

              <Text style={styles.stateText}>
                Essayez de modifier votre recherche ou vos filtres
                pour découvrir d'autres logements.
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleResetFilters}
              >
                <Text style={styles.retryText}>
                  Réinitialiser les filtres
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
        ListFooterComponent={
          !loading &&
          !error &&
          result.data.length > 0 ? (
            <Pagination
              page={result.page}
              totalPages={totalPages}
              total={result.total}
              limit={result.limit || PAGE_SIZE}
              onPageChange={setPage}
            />
          ) : null
        }
      />

      {/* Modal des filtres avancés */}
      {filtersVisible && (
        <PropertyFilterModal
          type={selectedType}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onClose={() => setFiltersVisible(false)}
          onApply={(filters) => {
            handleApplyFilters(filters);
            setFiltersVisible(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 24,
  },

  list: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
    flexGrow: 1,
  },

  emptyList: {
    flexGrow: 1,
  },

  intro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  introText: {
    flex: 1,
    paddingRight: 10,
  },

  heading: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.title,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },

  homeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 23,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: COLORS.title,
    fontSize: 13,
  },

  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.title,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 11,
    gap: 6,
  },

  filterButtonText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
  },

  filterCount: {
    backgroundColor: COLORS.primary,
    width: 19,
    height: 19,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  filterCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },

  typeList: {
    gap: 9,
    paddingBottom: 23,
  },

  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },

  typeTextActive: {
    color: COLORS.white,
  },

  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  resultsCount: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 5,
  },

  resetText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "700",
  },

  stateContainer: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  stateIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.title,
    textAlign: "center",
    marginBottom: 8,
  },

  stateText: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },

  retryText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
