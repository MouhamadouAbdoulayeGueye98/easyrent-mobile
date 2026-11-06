
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function HomeHeader({
  unreadCount = 0,
  scrollY,
  visible = false,
  topInset = 0,
}) {
  const notificationCount = Math.max(0, Number(unreadCount) || 0);

  const opacity = scrollY.interpolate({
    inputRange: [40, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const translateY = scrollY.interpolate({
    inputRange: [40, 120],
    outputRange: [-12, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      pointerEvents={visible ? "box-none" : "none"}
      style={[
        styles.container,
        {
          paddingTop: topInset,
          height: topInset + 64,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Image
              source={require("../../assets/images/easyrent-icon-1024.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandName}>Easy Rent</Text>
        </View>

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
            color="#1749A6"
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  content: {
    height: 64,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  logoImage: {
    width: 34,
    height: 34,
  },

  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1749A6",
    marginLeft: 9,
    letterSpacing: 0.2,
  },

  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
});
