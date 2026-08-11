import { ImageBackground, StyleSheet, Text, View } from "react-native";

export default function HeroSection() {
  return (
    <ImageBackground
      source={require("../../assets/images/image1.jpg")}
      style={styles.hero}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <Text style={styles.location}>📍 Dakar, Sénégal</Text>

        <Text style={styles.title}>
          Trouvez votre{"\n"}logement idéal
        </Text>

        <Text style={styles.subtitle}>
          Découvrez des chambres, studios et appartements partout au Sénégal.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 320,
    justifyContent: "flex-end",
  },

  image: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 24,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  location: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },

  subtitle: {
    color: "#F3F4F6",
    fontSize: 16,
    marginTop: 12,
    lineHeight: 22,
  },
});