import { Pressable, StyleSheet, Text } from "react-native";
import { COLORS } from "../../constants/colors";
import { SIZES } from "../../constants/sizes";

export default function CustomButton({
  title,
  onPress,
  style,
  disabled = false,
}) {
  return (
    <Pressable
      style={[
        styles.button,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    height: SIZES.buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.radius,
  },

  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  disabled: {
    opacity: 0.5,
  },
});