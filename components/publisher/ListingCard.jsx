import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function ListingCard({ listing }) {
  return (
    <View style={styles.card}>
      <Image
        source={listing.image}
        style={styles.image}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          {listing.title}
        </Text>

        <Text style={styles.location}>
          📍 {listing.city}
        </Text>

        <Text style={styles.price}>
          {listing.price.toLocaleString()} FCFA
        </Text>

        <View style={styles.stats}>
          <View style={styles.item}>
            <Ionicons
              name="eye-outline"
              size={18}
              color="#6B7280"
            />
            <Text>{listing.views}</Text>
          </View>

          <View style={styles.item}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#6B7280"
            />
            <Text>{listing.requests}</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons
              name="create-outline"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.buttonText}>
              Modifier
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton}>
            <Ionicons
              name="trash-outline"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.buttonText}>
              Supprimer
            </Text>
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