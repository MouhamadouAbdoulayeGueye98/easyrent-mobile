import { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Header from "../../components/common/Header";
import RequestCard from "../../components/publisher/RequestCard";
import { getVisits } from "../../services/visits";

export default function ClientRequests() {
  const [requests, setRequests] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchClientRequests() {
        try {
          const data = await getVisits();
          if (isActive && data) {
            setRequests(data);
          }
        } catch (error) {
          console.error("Erreur chargement visites client :", error);
        }
      }

      fetchClientRequests();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header
        title="Mes visites"
        showBack={true}
        onBackPress={() => router.back()}
      />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            hideActions={true}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
});