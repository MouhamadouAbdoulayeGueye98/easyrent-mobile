import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

// Construit la liste des pages à afficher, ex. [1, '…', 4, 5, 6, '…', 12]
function getPageItems(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push("…");
  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }
  if (end < totalPages - 1) items.push("…");

  items.push(totalPages);

  return items;
}

export default function Pagination({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 5,
  onPageChange,
}) {
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const items = getPageItems(page, totalPages);

  return (
    <View style={styles.container}>
      <Text style={styles.rangeText}>
        Affichage de <Text style={styles.rangeStrong}>{from}</Text> à{" "}
        <Text style={styles.rangeStrong}>{to}</Text> sur{" "}
        <Text style={styles.rangeStrong}>{total}</Text>
      </Text>

      {totalPages > 1 && (
        <View style={styles.pages}>
          <TouchableOpacity
            style={[styles.pageButton, page <= 1 && styles.pageButtonDisabled]}
            onPress={() => onPageChange(page - 1)}
            disabled={page <= 1}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={page <= 1 ? "#94A3B8" : "#334155"}
            />
          </TouchableOpacity>

          {items.map((item, index) =>
            item === "…" ? (
              <Text key={`dots-${index}`} style={styles.dots}>
                …
              </Text>
            ) : (
              <TouchableOpacity
                key={item}
                style={[
                  styles.pageButton,
                  item === page && styles.pageButtonActive,
                ]}
                onPress={() => onPageChange(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pageText,
                    item === page && styles.pageTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ),
          )}

          <TouchableOpacity
            style={[
              styles.pageButton,
              page >= totalPages && styles.pageButtonDisabled,
            ]}
            onPress={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            activeOpacity={0.8}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={page >= totalPages ? "#94A3B8" : "#334155"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: "center",
    gap: 12,
  },

  rangeText: {
    fontSize: 12,
    color: "#64748B",
  },

  rangeStrong: {
    fontWeight: "700",
    color: "#334155",
  },

  pages: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  pageButton: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  pageButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  pageButtonDisabled: {
    opacity: 0.45,
  },

  pageText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  pageTextActive: {
    color: "#FFFFFF",
  },

  dots: {
    paddingHorizontal: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
  },
});
