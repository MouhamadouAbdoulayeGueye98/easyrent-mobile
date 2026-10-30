
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ConversationCard({
  conversation,
  onPress,
}) {
  const unread = conversation.unread || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={25}
            color="#2563EB"
          />
        </View>

        {unread > 0 && <View style={styles.onlineDot} />}
      </View>

      {/* Conversation details */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {conversation.name || "Utilisateur"}
          </Text>
        </View>

        <Text
          style={[
            styles.message,
            unread > 0 && styles.unreadMessage,
          ]}
          numberOfLines={1}
        >
          {conversation.lastMessage || "Aucun message"}
        </Text>

        <View style={styles.propertyRow}>
          <Ionicons
            name="home-outline"
            size={13}
            color="#64748B"
          />
          <Text style={styles.property} numberOfLines={1}>
            {conversation.property}
          </Text>
        </View>
      </View>

      {/* Time and unread counter */}
      <View style={styles.rightContent}>
        <Text style={styles.time}>
          {conversation.time}
        </Text>

        {unread > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unread > 99 ? "99+" : unread}
            </Text>
          </View>
        ) : (
          <View style={styles.checkContainer}>
            <Ionicons
              name="checkmark-done"
              size={17}
              color="#94A3B8"
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
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#F1F5F9",

    elevation: 2,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },

  avatarContainer: {
    position: "relative",
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  onlineDot: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#2563EB",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    right: -2,
    bottom: -1,
  },

  content: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
  },

  message: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 7,
  },

  unreadMessage: {
    color: "#334155",
    fontWeight: "600",
  },

  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  property: {
    fontSize: 11,
    color: "#64748B",
    flex: 1,
  },

  rightContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingVertical: 2,
    minWidth: 45,
  },

  time: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },

  badge: {
    minWidth: 21,
    height: 21,
    paddingHorizontal: 5,
    borderRadius: 11,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  checkContainer: {
    marginTop: 3,
  },
});
