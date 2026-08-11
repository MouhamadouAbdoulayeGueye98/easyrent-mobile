import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SelectInput({
  label,
  placeholder,
  value,
  options,
  onSelect,
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>

      <Text style={styles.label}>
        {label}
      </Text>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setOpen(!open)}
      >
        <Text
          style={[
            styles.text,
            !value && styles.placeholder,
          ]}
        >
          {value || placeholder}
        </Text>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>


      {open && (
        <View style={styles.dropdown}>

          {options.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.option}
              onPress={() => {
                onSelect(item.value);
                setOpen(false);
              }}
            >

              <Text style={styles.optionText}>
                {item.label}
              </Text>

            </TouchableOpacity>
          ))}

        </View>
      )}

    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    marginBottom: 18,
  },


  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },


  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


  text: {
    fontSize: 16,
    color: "#111827",
  },


  placeholder: {
    color: "#9CA3AF",
  },


  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginTop: 5,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    overflow: "hidden",
  },


  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },


  optionText: {
    fontSize: 16,
    color: "#111827",
  },

});