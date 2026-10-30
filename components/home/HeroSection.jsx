
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function HeroSection({ unreadCount = 0 }) {
  const notificationCount = Math.max(0, Number(unreadCount) || 0);

  return (
    <ImageBackground
      source={require("../../assets/images/image1.jpg")}
      style={styles.hero}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[
          "rgba(10, 20, 40, 0.30)",
          "rgba(10, 20, 40, 0.45)",
          "rgba(10, 20, 40, 0.88)",
        ]}
        locations={[0, 0.45, 1]}
        style={styles.overlay}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons
                name="home"
                size={18}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.brandName}>Easy Rent</Text>
          </View>

          {/* NOTIFICATIONS */}
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`${notificationCount} notifications non lues`}
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color="#FFFFFF"
            />

            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? "9+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* HERO CONTENT */}
        <View style={styles.content}>
          <View style={styles.locationBadge}>
            <Ionicons
              name="location"
              size={14}
              color="#FFFFFF"
            />
            <Text style={styles.locationText}>
              Dakar, Sénégal
            </Text>
          </View>

          <Text style={styles.title}>
            Trouvez votre{"\n"}
            <Text style={styles.highlight}>logement idéal.</Text>
          </Text>

          <Text style={styles.subtitle}>
            Votre prochain chez-vous est peut-être à quelques clics.
            Découvrez des chambres, studios et appartements partout
            au Sénégal.
          </Text>

          <View style={styles.trustRow}>
            <View style={styles.trustIcon}>
              <Ionicons
                name="shield-checkmark"
                size={15}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.trustText}>
              Trouvez votre logement en toute confiance
            </Text>
          </View>
        </View>

        {/* DECORATIVE INDICATOR */}
        <View style={styles.bottomIndicator} />
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 340,
    overflow: "hidden",
    backgroundColor: "#1E293B",
  },

  image: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "space-between",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  brandName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    marginLeft: 9,
    letterSpacing: 0.2,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.17)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    top: -5,
    right: -5,
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
    fontSize: 9,
    fontWeight: "800",
  },

  content: {
    marginTop: 15,
  },

  locationBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 16,
  },

  locationText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 31,
    lineHeight: 39,
    fontWeight: "900",
    letterSpacing: -0.8,
  },

  highlight: {
    color: "#93C5FD",
  },

  subtitle: {
    color: "#E5E7EB",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 12,
    maxWidth: 310,
  },

  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
  },

  trustIcon: {
    width: 25,
    height: 25,
    borderRadius: 9,
    backgroundColor: "rgba(16,185,129,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  trustText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 8,
  },

  bottomIndicator: {
    width: 38,
    height: 4,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.65)",
    alignSelf: "center",
    marginTop: 12,
  },
});
