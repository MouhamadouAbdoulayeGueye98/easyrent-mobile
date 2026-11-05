import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { deleteProperty } from "../../services/propertyService";

const COLORS = {
  primary: "#1749A6",
  primaryLight: "#EAF0FC",
  background: "#FFFFFF",
  text: "#172033",
  secondary: "#718096",
  border: "#E8ECF2",
  success: "#16A36A",
  successLight: "#E8F7EF",
  danger: "#E5484D",
  dangerLight: "#FFF0F0",
};

export default function ListingCard({
  listing,
  onDeleted,
}) {
  if (!listing) return null;

  const image =
    listing.photos?.[0]?.url ||
    listing.photos?.[0]?.uri ||
    listing.images?.[0] ||
    null;

  const title = listing.title || "Sans titre";
  const city = listing.city || "Localisation non précisée";
  const price = Number(listing.price || 0);

  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const views = listing.views ?? 0;
  const requests = listing.requestsCount ?? listing.visitRequests?.length ?? 0;

  const isAvailable =
    listing.available !== false &&
    listing.availability !== "UNAVAILABLE";

  const handleEdit = () => {
    if (!listing.id) {
      Alert.alert(
        "Erreur",
        "Impossible de modifier cette annonce : identifiant introuvable."
      );
      return;
    }

    router.push({
      pathname: "/publisher/edit/[id]",
      params: { id: String(listing.id) },
    });
  };

  const handleDelete = async () => {
    if (!listing.id || deleting) return;

    try {
      setDeleting(true);

      await deleteProperty(listing.id);

      setDeleteModalVisible(false);

      onDeleted?.(listing.id);
    } catch (error) {
      console.error(
        "Erreur suppression annonce :",
        error.response?.data || error.message,
      );

      // Conserve ici ton système de toast si tu en utilises un.
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* IMAGE */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="home-outline" size={42} color="#A0AEC0" />
            <Text style={styles.placeholderText}>Aucune photo disponible</Text>
          </View>
        )}

        <View
          style={[
            styles.statusBadge,
            isAvailable ? styles.availableBadge : styles.unavailableBadge,
          ]}
        >
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isAvailable ? COLORS.success : COLORS.danger,
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              {
                color: isAvailable ? COLORS.success : COLORS.danger,
              },
            ]}
          >
            {isAvailable ? "Disponible" : "Indisponible"}
          </Text>
        </View>
      </View>

      {/* INFORMATIONS */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.locationRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={COLORS.secondary}
          />
          <Text style={styles.location} numberOfLines={1}>
            {city}
            {listing.quartier ? `, ${listing.quartier}` : ""}
          </Text>
        </View>

        <Text style={styles.price}>
          {price.toLocaleString("fr-FR")} FCFA
          <Text style={styles.pricePeriod}> / mois</Text>
        </Text>

        {/* STATISTIQUES */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={18} color={COLORS.secondary} />
            <Text style={styles.statValue}>{views}</Text>
            <Text style={styles.statLabel}>Vues</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={COLORS.secondary}
            />
            <Text style={styles.statValue}>{requests}</Text>
            <Text style={styles.statLabel}>Demandes</Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEdit}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setDeleteModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          if (!deleting) setDeleteModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="trash-outline" size={30} color={COLORS.danger} />
            </View>

            <Text style={styles.modalTitle}>Supprimer cette annonce ?</Text>

            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir supprimer «{" "}
              {listing.title || "cette annonce"} » ? Cette action est
              irréversible.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={17} color="#FFFFFF" />
                    <Text style={styles.confirmDeleteText}>Supprimer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: "#172033",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  imageContainer: {
    height: 185,
    width: "100%",
    backgroundColor: "#F1F4F8",
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    color: COLORS.secondary,
    fontSize: 12,
    marginTop: 8,
  },

  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  availableBadge: {
    backgroundColor: COLORS.successLight,
  },

  unavailableBadge: {
    backgroundColor: COLORS.dangerLight,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  content: {
    padding: 16,
  },

  titleRow: {
    marginBottom: 7,
  },

  title: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  location: {
    color: COLORS.secondary,
    fontSize: 13,
    marginLeft: 5,
    flex: 1,
  },

  price: {
    color: COLORS.primary,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 16,
  },

  pricePeriod: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "400",
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFD",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },

  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  statValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },

  statLabel: {
    color: COLORS.secondary,
    fontSize: 12,
    marginLeft: 4,
  },

  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: COLORS.border,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  editButton: {
    flex: 1,
    height: 46,
    backgroundColor: COLORS.primary,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    height: 46,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#FFDADA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  deleteButtonText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },

  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },

  modalMessage: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },

  modalActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F4F8",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },

  confirmDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.danger,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  confirmDeleteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
