import { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import Header from "../../components/common/Header";
import RequestCard from "../../components/publisher/RequestCard";
import { getVisits, acceptVisit, refuseVisit } from "../../services/visits";

export default function PublisherRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const data = await getVisits();
      if (data) {
        setRequests(data);
      }
    } catch (error) {
      console.error("Erreur chargement demandes annonceur :", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [])
  );

  const handleAccept = async (id) => {
    try {
      await acceptVisit(id);
      Alert.alert("Succès", "La demande de visite a été acceptée.");
      fetchRequests(); // Recharge la liste pour mettre à jour le statut et masquer les boutons
    } catch (error) {
      console.error("Détail erreur acceptation :", error.response?.data || error.message);
      Alert.alert("Erreur", "Impossible d'accepter cette demande.");
    }
  };

  const handleReject = async (id) => {
    try {
      await refuseVisit(id);
      Alert.alert("Succès", "La demande de visite a été refusée.");
      fetchRequests(); // Recharge la liste
    } catch (error) {
      console.error("Détail erreur refus :", error.response?.data || error.message);
      Alert.alert("Erreur", "Impossible de refuser cette demande.");
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/publisher");
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Demandes de visites"
        showBack={true}
        onBackPress={handleBack}
      />

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            hideActions={false}
            onAccept={() => handleAccept(item.id)}
            onReject={() => handleReject(item.id)}
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