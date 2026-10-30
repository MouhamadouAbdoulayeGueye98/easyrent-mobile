import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import Header from "../../components/common/Header";
import Pagination from "../../components/common/Pagination";
import HouseCard from "../../components/home/HouseCard";
import PropertyFilterModal from "../../components/properties/PropertyFilterModal";
import { getPropertiesPage } from "../../services/properties";

const PAGE_SIZE = 5;

function firstParam(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default function PropertiesList() {
  const params = useLocalSearchParams();

  const section = firstParam(params.section);
  const search = firstParam(params.search).trim();
  const routeType = firstParam(params.type);

  const isNew = section === "new";

  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState(routeType || "TOUS");
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
          ...(selectedType !== "TOUS" ? { type: selectedType } : {}),
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

  const handleApplyFilters = ({ type, minPrice: nextMin, maxPrice: nextMax }) => {
    setSelectedType(type);
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    setPage(1);
  };

  const totalPages = result.totalPages || 1;

  return (
    <View style={styles.container}>
      <Header
        title={isNew ? "Nouveautés" : "Populaires"}
        showBack={true}
        rightText="☷"
        onRightPress={() => setFiltersVisible(true)}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : result.data.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Aucune annonce trouvée.</Text>
        </View>
      ) : (
        <FlatList
          data={result.data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HouseCard house={item} variant="large" />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Pagination
              page={result.page}
              totalPages={totalPages}
              total={result.total}
              limit={result.limit || PAGE_SIZE}
              onPageChange={setPage}
            />
          }
        />
      )}

      {filtersVisible && (
        <PropertyFilterModal
          type={selectedType}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onClose={() => setFiltersVisible(false)}
          onApply={handleApplyFilters}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  empty: {
    color: "#6B7280",
    textAlign: "center",
  },

  error: {
    color: "#EF4444",
    textAlign: "center",
    fontSize: 15,
  },
});
