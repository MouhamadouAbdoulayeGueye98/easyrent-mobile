import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";

export default function ConversationCard({ conversation }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => router.push(`/chat/${conversation.id}`)}
    >
      <Image source={conversation.avatar} style={styles.avatar} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{conversation.name}</Text>

          <Text style={styles.time}>{conversation.time}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text numberOfLines={1} style={styles.message}>
            {conversation.lastMessage}
          </Text>

          {conversation.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{conversation.unread}</Text>
            </View>
          )}
        </View>
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

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  content: {
    flex: 1,
    marginLeft: 15,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  time: {
    color: "#aeb7c1",
    fontSize: 13,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  message: {
    flex: 1,
    color: "#0d0e0e",
    marginRight: 10,
  },

  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 12,
  },
});