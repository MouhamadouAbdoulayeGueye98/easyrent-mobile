import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ConversationCard({ conversation, currentUserId }) {
  const isOwner = conversation.ownerId === currentUserId;
  const otherUser = isOwner ? conversation.tenant : conversation.owner;
  const lastMessage = conversation.messages?.[0];
  const photoUrl = conversation.property?.photos?.[0]?.url;

  const time = lastMessage
    ? new Date(lastMessage.createdAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => router.push(`/chat/${conversation.id}`)}
    >
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="home-outline" size={26} color="#2563EB" />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {otherUser?.name || "Utilisateur"}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        <Text style={styles.property} numberOfLines={1}>
          {conversation.property?.title}
        </Text>

        <Text numberOfLines={1} style={styles.message}>
          {lastMessage?.content || "Démarrer la conversation"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 2,
  },
  avatar: { width: 60, height: 60, borderRadius: 16 },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { flex: 1, marginLeft: 15 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 16, fontWeight: "700", color: "#111827", flex: 1, marginRight: 8 },
  time: { color: "#9CA3AF", fontSize: 12 },
  property: { color: "#2563EB", fontSize: 13, fontWeight: "600", marginTop: 2 },
  message: { color: "#6B7280", marginTop: 4 },
});