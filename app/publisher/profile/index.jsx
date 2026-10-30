
import { useState, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";

import { useToast } from "../../../context/ToastContext";
import Header from "../../../components/common/Header";
import ProfileMenuItem from "../../../components/publisher/ProfileMenuItem";
import { useAuth } from "../../../context/AuthContext";
import { getUserRole } from "../../../services/auth";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  background: "#F4F7FC",
  surface: "#FFFFFF",
  text: "#172033",
  muted: "#758198",
  border: "#E2E8F0",
  blueSoft: "#EAF1FF",
  green: "#15966A",
  greenSoft: "#E8F7F0",
  orange: "#D97706",
  orangeSoft: "#FFF4E5",
  purple: "#7956D8",
  purpleSoft: "#F0EBFF",
  red: "#DC2626",
  redSoft: "#FEF2F2",
};

export default function PublisherProfile() {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchProfile() {
        try {
          setLoading(true);
          const profile = await getUserRole();

          if (isActive && profile) {
            setUser(profile);
          }
        } catch (error) {
          console.error(
            "Erreur chargement profil :",
            error.response?.data || error,
          );

          if (isActive) {
            showToast("Impossible de charger le profil.", "error");
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      }

      fetchProfile();

      return () => {
        isActive = false;
      };
    }, [setUser, showToast]),
  );

  function handleLogout() {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/auth/login");
            } catch (error) {
              console.error(
                "Erreur déconnexion :",
                error.response?.data || error,
              );

              showToast("Impossible de vous déconnecter.", "error");
            }
          },
        },
      ],
    );
  }

  const fullName = user?.name || "Nom non renseigné";
  const publisherType = user?.publisherType || "Particulier";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (loading || !user) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement de votre profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* En-tête du profil */}
      <View style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={38} color={COLORS.primary} />
            </View>
            <View style={styles.avatarStatus}>
              <Ionicons name="checkmark" size={12} color={COLORS.surface} />
            </View>
          </View>

          <View style={styles.profileIdentity}>
            <Text style={styles.eyebrow}>ESPACE ANNONCEUR</Text>
            <Text style={styles.name} numberOfLines={2}>
              {fullName}
            </Text>

            <View style={styles.badge}>
              <Ionicons
                name="business-outline"
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.badgeText}>{publisherType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.profileDivider} />

        <View style={styles.memberRow}>
          <View style={styles.memberIcon}>
            <Ionicons name="calendar-outline" size={17} color={COLORS.muted} />
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberLabel}>Membre depuis</Text>
            <Text style={styles.memberValue}>
              {memberSince || "Date non disponible"}
            </Text>
          </View>
          <Ionicons
            name="shield-checkmark-outline"
            size={21}
            color={COLORS.green}
          />
        </View>
      </View>

      {/* Informations personnelles */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          <Text style={styles.sectionSubtitle}>
            Vos coordonnées et informations de contact
          </Text>
        </View>
        <View style={styles.sectionIcon}>
          <Ionicons name="person-outline" size={19} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.menuCard}>
        <ProfileMenuItem
          icon="person-outline"
          color={COLORS.primary}
          title="Nom complet"
          subtitle={user.name || "Non renseigné"}
          showArrow={false}
        />

        <View style={styles.menuDivider} />

        <ProfileMenuItem
          icon="call-outline"
          color={COLORS.green}
          title="Téléphone"
          subtitle={user.phone || "Non renseigné"}
          showArrow={false}
        />

        <View style={styles.menuDivider} />

        <ProfileMenuItem
          icon="mail-outline"
          color={COLORS.orange}
          title="Adresse email"
          subtitle={user.email || "Non renseignée"}
          showArrow={false}
        />

        <View style={styles.menuDivider} />

        <ProfileMenuItem
          icon="location-outline"
          color={COLORS.purple}
          title="Ville"
          subtitle={user.city || "Non renseignée"}
          showArrow={false}
        />
      </View>

      {/* Compte annonceur */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Compte annonceur</Text>
          <Text style={styles.sectionSubtitle}>Votre statut sur Easy Rent</Text>
        </View>
        <View style={styles.sectionIcon}>
          <Ionicons name="business-outline" size={19} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.menuCard}>
        <ProfileMenuItem
          icon="briefcase-outline"
          color={COLORS.primary}
          title="Type d'annonceur"
          subtitle={publisherType}
          showArrow={false}
        />

        <View style={styles.menuDivider} />

        <ProfileMenuItem
          icon="shield-checkmark-outline"
          color={user.verified ? COLORS.green : COLORS.orange}
          title="Vérification du compte"
          subtitle={
            user.verified ? "Compte vérifié" : "En attente de vérification"
          }
          showArrow={false}
        />
      </View>

      {/* Paramètres */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <Text style={styles.sectionSubtitle}>
            Personnalisez votre expérience
          </Text>
        </View>
        <View style={styles.sectionIcon}>
          <Ionicons name="options-outline" size={19} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.menuCard}>
        <ProfileMenuItem
          icon="notifications-outline"
          color="#D97706"
          title="Notifications"
          subtitle="Consulter vos alertes"
          onPress={() => router.push("/notifications")}
        />

        <View style={styles.menuDivider} />

        <ProfileMenuItem
          icon="settings-outline"
          color={COLORS.primary}
          title="Paramètres"
          subtitle="Préférences et compte"
          onPress={() => router.push("/publisher/profile/settings")}
        />
      </View>

      {/* Déconnexion */}
      <TouchableOpacity
        activeOpacity={0.75}
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <View style={styles.logoutIcon}>
          <Ionicons name="log-out-outline" size={21} color={COLORS.red} />
        </View>

        <View style={styles.logoutInfo}>
          <Text style={styles.logoutTitle}>Déconnexion</Text>
          <Text style={styles.logoutSubtitle}>
            Quitter votre espace annonceur
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={19} color={COLORS.red} />
      </TouchableOpacity>

      {/* Pied de page Easy Rent */}
      <View style={styles.footer}>
        <View style={styles.footerBrandRow}>
          <Image
            source={require("../../../assets/images/easyrent-icon-1024.png")}
            style={styles.footerLogo}
            resizeMode="contain"
          />

          <Text style={styles.footerBrand}>Easy Rent</Text>
        </View>

        <Text style={styles.footerText}>
          Votre espace immobilier, simplement.
        </Text>

        <Text style={styles.footerCopyright}>
          © {new Date().getFullYear()} Easy Rent. Tous droits réservés.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 25,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.muted,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 115,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 20,
    marginTop: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.035,
    shadowRadius: 12,
    elevation: 2,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 25,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D7E5FF",
  },
  avatarStatus: {
    position: "absolute",
    right: -3,
    bottom: -3,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    borderWidth: 3,
    borderColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  profileIdentity: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: COLORS.primary,
    marginBottom: 6,
  },
  name: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    color: COLORS.text,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    backgroundColor: COLORS.blueSoft,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  profileDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 18,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F6FA",
    marginRight: 11,
  },
  memberInfo: {
    flex: 1,
  },
  memberLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginBottom: 3,
  },
  memberValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 3,
    marginBottom: 27,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.025,
    shadowRadius: 8,
    elevation: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F0F3F8",
    marginLeft: 48,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  logoutIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.redSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoutInfo: {
    flex: 1,
  },
  logoutTitle: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: "800",
  },
  logoutSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  footer: {
    alignItems: "center",
    marginTop: 25,
    paddingTop: 18,
    paddingBottom: 10,
  },

  footerBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  footerLogo: {
    width: 30,
    height: 30,
  },

  footerBrand: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 0.2,
  },

  footerText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
  },

  footerCopyright: {
    fontSize: 10,
    color: "#9AA4B5",
    marginTop: 8,
  },
});
