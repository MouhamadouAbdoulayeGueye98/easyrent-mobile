
import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";

export default function ProfileHeader() {
  const { user } = useAuth();

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const role =
    user?.role === "publisher"
      ? user?.publisherType || "Annonceur"
      : "Client";

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.topSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {initial}
              </Text>
            </View>

            <View style={styles.onlineIndicator} />
          </View>

          <View style={styles.identity}>
            <Text style={styles.name} numberOfLines={1}>
              {user?.name || "Nom d'utilisateur"}
            </Text>

            <View style={styles.roleBadge}>
              <Ionicons
                name="person-outline"
                size={13}
                color="#2563EB"
              />
              <Text style={styles.roleText}>
                {role}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#64748B"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Adresse e-mail</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user?.email || "Email non renseigné"}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="call-outline"
              size={18}
              color="#64748B"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>
              {user?.phone || "Téléphone non renseigné"}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="location-outline"
              size={18}
              color="#64748B"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Localisation</Text>
            <Text style={styles.infoValue}>
              {user?.city || "Ville non renseignée"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 12,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EEF1F6",

    shadowColor: "#64748B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  topSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 27,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  onlineIndicator: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#22C55E",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    bottom: 0,
    right: 0,
  },

  identity: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#172033",
    marginBottom: 8,
  },

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },

  roleText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F3F7",
    marginBottom: 13,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  infoIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "600",
  },
});
