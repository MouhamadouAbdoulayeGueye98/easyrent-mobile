import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";

export default function FormButton({
  title,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
  },

  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
});