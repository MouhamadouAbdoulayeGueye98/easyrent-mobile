import {
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

export default function PickerInput({
  label,
  value,
  onValueChange,
  items = [],
  placeholder = "Sélectionner",
}) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value || ""}
          onValueChange={(itemValue) => {
            onValueChange(itemValue);
          }}
          mode="dropdown"
          style={styles.picker}
        >
          <Picker.Item
            label={placeholder}
            value=""
          />

          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },

  pickerContainer: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    justifyContent: "center",
  },

  picker: {
    height: 55,
    width: "100%",
  },
});