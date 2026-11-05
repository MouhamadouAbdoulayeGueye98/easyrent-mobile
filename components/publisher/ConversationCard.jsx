import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#1749A6",
  primaryLight: "#EAF0FC",
  background: "#FFFFFF",
  text: "#172033",
  secondary: "#718096",
  muted: "#A0AEC0",
  border: "#EDF0F5",
  unreadBackground: "#F5F8FF",
  success: "#16A36A",
};

export default function ConversationCard({
  conversation,
  onPress,
}) {
  const unread = Number(conversation?.unread || 0);

  const name = conversation?.name || "Utilisateur";
  const lastMessage = conversation?.lastMessage || "Aucun message";
  const property = conversation?.property || "Logement";
  const time = conversation?.time || "";

  // Initiales du correspondant
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <TouchableOpacity
      style={[
        styles.card,
        unread > 0 && styles.unreadCard,
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* AVATAR */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials || "U"}
          </Text>
        </View>

        {unread > 0 && (
          <View style={styles.onlineDot} />
        )}
      </View>

      {/* CONTENU */}
      <View style={styles.content}>
        {/* NOM */}
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.name,
              unread > 0 && styles.unreadName,
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        {/* DERNIER MESSAGE */}
        <Text
          style={[
            styles.message,
            unread > 0 && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {lastMessage}
        </Text>

        {/* LOGEMENT */}
        <View style={styles.propertyRow}>
          <Ionicons
            name="home-outline"
            size={13}
            color={COLORS.muted}
          />

          <Text
            style={styles.property}
            numberOfLines={1}
          >
            {property}
          </Text>
        </View>
      </View>

      {/* HEURE ET BADGE */}
      <View style={styles.rightContent}>
        <Text style={styles.time} numberOfLines={1}>
          {time}
        </Text>

        {unread > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unread > 99 ? "99+" : unread}
            </Text>
          </View>
        ) : (
          <View style={styles.readContainer}>
            <Ionicons
              name="checkmark-done"
              size={17}
              color={COLORS.success}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 17,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  unreadCard: {
    backgroundColor: COLORS.unreadBackground,
    borderColor: "#E1EAFE",
  },

  // AVATAR
  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 53,
    height: 53,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
  },

  onlineDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    right: -2,
    bottom: -1,
  },

  // CONTENU
  content: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
    justifyContent: "center",
    minWidth: 0,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    flexShrink: 1,
  },

  unreadName: {
    fontWeight: "800",
  },

  message: {
    fontSize: 13,
    color: COLORS.secondary,
    marginBottom: 7,
  },

  unreadMessage: {
    color: COLORS.text,
    fontWeight: "600",
  },

  // LOGEMENT
  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  property: {
    fontSize: 11,
    color: COLORS.muted,
    flex: 1,
  },

  // PARTIE DROITE
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingVertical: 2,
    minWidth: 42,
  },

  time: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "500",
    maxWidth: 55,
  },

  badge: {
    minWidth: 21,
    height: 21,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  readContainer: {
    marginTop: 3,
  },
});
