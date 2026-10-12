import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import ScreenHeader from "../../components/common/ScreenHeader";
import SearchBar from "../../components/home/SearchBar";
import HouseCard from "../../components/home/HouseCard";

import { useGetPropertiesQuery } from '../../services/api';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Utilisation du hook RTK Query centralisé
  const { data: properties = [], isLoading: loading, error } = useGetPropertiesQuery();

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return properties;
    const text = searchQuery.toLowerCase().trim();
    return properties.filter(
      (house) =>
        house.title?.toLowerCase().includes(text) ||
        house.city?.toLowerCase().includes(text) ||
        house.quartier?.toLowerCase().includes(text)
    );
  }, [searchQuery, properties]);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScreenHeader
        title="Recherche"
        subtitle="Trouvez rapidement un logement."
      />
      
      <SearchBar
        placeholder="Région, Ville..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={{ color: '#EF4444' }}>Erreur de chargement des annonces.</Text>
          </View>
        ) : filteredProperties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune annonce trouvée.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProperties}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            renderItem={({ item }) => (
              <HouseCard house={item} variant="vertical" />
            )}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, color: '#888' },
});