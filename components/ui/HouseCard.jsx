import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

import { router } from "expo-router";
import { useState } from "react";

export default function HouseCard({ house }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <TouchableOpacity
      style={styles.card}

      onPress={() => router.push(`/house/${house.id}`)}
    >
      <View>
        <Image
          source={house.image}

          style={styles.image}
        />

        <TouchableOpacity
          style={styles.heart}

          onPress={() => setFavorite(!favorite)}
        >
          <Text>{favorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{house.title}</Text>

        <Text style={styles.location}>📍 {house.location}</Text>

        <Text style={styles.price}>{house.price}/mois</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",

    borderRadius: 20,

    marginHorizontal: 20,

    marginBottom: 20,

    overflow: "hidden",
  },

  image: {
    width: "100%",

    height: 220,
  },

  heart: {
    position: "absolute",

    right: 15,

    top: 15,

    backgroundColor: "#fff",

    width: 40,

    height: 40,

    borderRadius: 20,

    alignItems: "center",

    justifyContent: "center",
  },

  content: {
    padding: 15,
  },

  title: {
    fontSize: 20,

    fontWeight: "bold",
  },

  location: {
    color: "#666",

    marginTop: 8,
  },

  price: {
    color: "#2563EB",

    fontSize: 18,

    fontWeight: "bold",

    marginTop: 10,
  },
});
