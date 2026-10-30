
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ConversationCard({
  conversation,
  currentUserId,
}) {
  // Déterminer le rôle de l'utilisateur connecté
  const isOwner = conversation.ownerId === currentUserId;

  // Récupérer l'autre participant
  const otherUser = isOwner
    ? conversation.tenant
    : conversation.owner;

  // Récupérer le dernier message
  const lastMessage = conversation.messages?.[0];

  // Récupérer la photo du logement
  const photoUrl = conversation.property?.photos?.[0]?.url;

  // Formater l'heure du dernier message
  const time = lastMessage?.createdAt
    ? new Date(lastMessage.createdAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.card}
      onPress={() => router.push(`/chat/${conversation.id}`)}
    >
      {/* Photo du logement */}
      <View style={styles.imageContainer}>
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons
              name="home-outline"
              size={27}
              color="#2563EB"
            />
          </View>
        )}
      </View>

      {/* Informations de la conversation */}
      <View style={styles.content}>
        {/* Nom et heure */}
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {otherUser?.name || "Utilisateur"}
          </Text>

          <Text style={styles.time}>
            {time}
          </Text>
        </View>

        {/* Nom du logement */}
        <View style={styles.propertyRow}>
          <Ionicons
            name="home-outline"
            size={13}
            color="#2563EB"
          />

          <Text style={styles.property} numberOfLines={1}>
            {conversation.property?.title || "Logement"}
          </Text>
        </View>

        {/* Dernier message */}
        <View style={styles.messageRow}>
          <Text
            numberOfLines={1}
            style={styles.message}
          >
            {lastMessage?.content || "Démarrer la conversation"}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={16}
            color="#CBD5E1"
          />
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

    paddingVertical: 14,
    paddingHorizontal: 14,

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

  imageContainer: {
    width: 62,
    height: 62,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#EFF6FF",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },

  content: {
    flex: 1,
    marginLeft: 13,
    justifyContent: "center",
    minWidth: 0,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginRight: 8,
  },

  time: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },

  propertyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
    gap: 5,
  },

  property: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },

  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  message: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    marginRight: 5,
  },
});
