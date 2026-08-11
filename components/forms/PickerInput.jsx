import {
  View,
  Text,
  StyleSheet,
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
          selectedValue={value}
          onValueChange={onValueChange}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  picker: {
    height: 55,
    width: "100%",
  },

});