import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { deleteProperty } from "../../services/propertyService";

export default function ListingCard({ listing, onDeleted }) {
  const imageUrl = listing.photos?.length > 0 ? listing.photos[0].url : null;

  function handleEdit() {
    router.push(`/publisher/edit/${listing.id}`);
  }

  async function handleDelete() {
    Alert.alert(
      "Supprimer l'annonce",
      "Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProperty(listing.id);

              Alert.alert(
                "Annonce supprimée",
                "L'annonce a été supprimée avec succès.",
              );

              // On demande au parent de rafraîchir la liste
              if (onDeleted) {
                onDeleted(listing.id);
              }
            } catch (error) {
              console.error(
                "Erreur suppression annonce :",
                error.response?.data || error,
              );

              Alert.alert("Erreur", "Impossible de supprimer cette annonce.");
            }
          },
        },
      ],
    );
  }

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={50} color="#9CA3AF" />
          <Text style={styles.placeholderText}>Aucune photo</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{listing.title}</Text>

        <Text style={styles.location}>📍 {listing.city}</Text>

        <Text style={styles.price}>
          {Number(listing.price).toLocaleString()} FCFA
        </Text>

        <View style={styles.stats}>
          <View style={styles.item}>
            <Ionicons name="eye-outline" size={18} color="#6B7280" />
            <Text>{listing.views ?? 0}</Text>
          </View>

          <View style={styles.item}>
            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
            <Text>{listing.requests ?? 0}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />

            <Text style={styles.buttonText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" />

            <Text style={styles.buttonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 180,
  },

  imagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 14,
  },

  content: {
    padding: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  location: {
    marginTop: 6,
    color: "#6B7280",
  },

  price: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB",
  },

  stats: {
    flexDirection: "row",
    marginTop: 15,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    gap: 6,
  },

  buttons: {
    flexDirection: "row",
    marginTop: 20,
  },

  editButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 10,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
  },
});
