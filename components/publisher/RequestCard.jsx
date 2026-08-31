import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function RequestCard({
  request,
  onAccept,
  onReject,
  hideActions = true, 
}) {
 
  const propertyTitle = 
    typeof request.property === "object" && request.property !== null
      ? request.property.title || request.property.address || "Logement"
      : request.property || "Logement";

  
  const displayName = hideActions
    ? request.ownerName || request.publisher || "Propriétaire / Annonceur"
    : request.clientName || request.user || "Client / Visiteur";

  const displayAvatarIcon = hideActions ? "business-outline" : "person-outline";

  // Fonction pour formater proprement la date brute de l'API
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return { date: "Date non spécifiée", time: "" };

    try {
      const dateObj = new Date(dateString);
      
      if (!isNaN(dateObj.getTime())) {
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('fr-FR', optionsDate);
        
        const formattedTime = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        return {
          date: formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1), 
          time: timeString || formattedTime
        };
      }
    } catch (e) {
      console.error("Erreur formatage date", e);
    }

    return { date: dateString, time: timeString || "" };
  };

  const { date: displayDate, time: displayTime } = formatDateTime(request.date, request.time);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons
            name={displayAvatarIcon}
            size={24}
            color="#2563EB"
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {displayName}
          </Text>

          <Text style={styles.property}>
            {propertyTitle}
          </Text>
        </View>

        <View
          style={[
            styles.status,
            request.status === "accepted" || request.status === "ACCEPTED" || request.status === "confirmed"
              ? styles.accepted
              : request.status === "rejected" || request.status === "REJECTED" || request.status === "refused" || request.status === "REFUSED"
              ? styles.rejected
              : styles.pending,
          ]}
        >
          <Text style={styles.statusText}>
            {request.status === "accepted" || request.status === "ACCEPTED" || request.status === "confirmed"
              ? "Acceptée"
              : request.status === "rejected" || request.status === "REJECTED" || request.status === "refused" || request.status === "REFUSED"
              ? "Refusée"
              : "En attente"}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#6B7280"
        />
        <Text style={styles.info}>
          {displayDate}
        </Text>
      </View>

      {displayTime ? (
        <View style={styles.infoRow}>
          <Ionicons
            name="time-outline"
            size={20}
            color="#6B7280"
          />
          <Text style={styles.info}>
            {displayTime}
          </Text>
        </View>
      ) : null}

      {request.message ? (
        <Text style={styles.message}>
          {request.message}
        </Text>
      ) : null}

      {!hideActions && (
        request.status === "pending" || 
        request.status === "PENDING" || 
        request.status === "en_attente" ||
        !request.status  
      ) && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
          >
            <Text style={styles.acceptText}>Accepter</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={onReject}
          >
            <Text style={styles.rejectText}>Refuser</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  property: {
    marginTop: 3,
    color: "#6B7280",
    fontWeight: "500",
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pending: {
    backgroundColor: "#FEF3C7",
  },
  accepted: {
    backgroundColor: "#D1FAE5",
  },
  rejected: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  info: {
    marginLeft: 10,
    color: "#4B5563",
    fontSize: 14,
  },
  message: {
    marginTop: 12,
    color: "#374151",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  rejectButton: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  acceptText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  rejectText: {
    color: "#EF4444",
    fontWeight: "700",
  },
});