import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function FormSection({
  title,
  children,
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>
        {title}
      </Text>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
});