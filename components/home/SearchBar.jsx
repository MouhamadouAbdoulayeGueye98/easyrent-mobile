
import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function SearchBar({
  placeholder = "Rechercher une région, une ville...",
  value = "",
  onChangeText,
}) {
  const hasValue = Boolean(value?.length);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.searchIcon}>
          <Ionicons
            name="search-outline"
            size={21}
            color={COLORS.primary || "#2563EB"}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
          accessibilityLabel="Rechercher un logement"
        />

        {hasValue && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText?.("")}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Effacer la recherche"
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },

  container: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",

    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },

  searchIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: "100%",
    marginLeft: 11,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    paddingVertical: 0,
  },

  clearButton: {
    width: 34,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
});