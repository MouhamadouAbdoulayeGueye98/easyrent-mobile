import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HeroSection({ unreadCount = 0 }) {
  return (
    <ImageBackground
      source={require("../../assets/images/image1.jpg")}
      style={styles.hero}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>

        {/* 🔔 Notification */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push("/notifications")}
          activeOpacity={0.8}
        >
          <Ionicons
            name="notifications-outline"
            size={26}
            color="#FFFFFF"
          />

          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

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
    height: 240,
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

  notificationButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  location: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    color: "#F3F4F6",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 18,
  },
});