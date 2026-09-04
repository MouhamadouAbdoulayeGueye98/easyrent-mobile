import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import ListingCard from "../../components/publisher/ListingCard";
import EmptyListings from "../../components/publisher/EmptyListings";

import { getMyProperties } from "../../services/propertyService";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadListings = async () => {
    try {
      setError(null);

      const data = await getMyProperties();

      setListings(data);
    } catch (error) {
      console.error("Erreur chargement mes annonces :", error);

      setError("Impossible de charger vos annonces.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadListings();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Chargement de vos annonces...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Mes annonces" />

        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <EmptyListings
        onPress={() => router.push("/publisher-create")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Mes annonces" />
      
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListingCard listing={item} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  list: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    color: "#64748B",
  },

  errorText: {
    color: "#EF4444",
    textAlign: "center",
    fontSize: 16,
  },
});