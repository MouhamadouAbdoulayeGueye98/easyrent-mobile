import { View, Text, StyleSheet, FlatList } from "react-native";

import { houses } from "../../constants/houses";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import HouseCard from "../../components/ui/HouseCard";
import GuestScreen from "../../components/common/GuestScreen";
import { useFavorites } from "../../context/FavoritesContext";

export default function Favorites() {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  

  const favoriteHouses = houses.filter((house) =>
    favorites.includes(house.id)
  );

  if (!user) {
    return (
      <View style={styles.container}>

        <GuestScreen
          icon="heart-outline"
          title="Vos favoris vous attendent"
          description="Connectez-vous pour sauvegarder vos logements préférés et les retrouver facilement."
        />
      </View>
    );
  }

  if (favoriteHouses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emoji}>❤️</Text>

        <Text style={styles.title}>Aucun favori</Text>

        <Text style={styles.subtitle}>
          Ajoutez des logements à vos favoris pour les retrouver rapidement.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mes favoris</Text>
      <Header title="Mes favoris" rightIcon="heart" />

      <FlatList
        data={favoriteHouses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HouseCard house={item} variant="large" />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F8FAFC",
  },

  emoji: {
    fontSize: 70,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 12,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 24,
    fontSize: 16,
  },
});