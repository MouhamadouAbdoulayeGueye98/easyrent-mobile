import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function OnboardingItem({ item, width }) {
  return (
    <View style={[styles.container, { width }]}>
      <Text style={styles.image}>
        {item.image}
      </Text>

      <Text style={styles.title}>
        {item.title}
      </Text>

      <Text style={styles.description}>
        {item.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  image: {
    fontSize: 120,
    marginBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 20,
  },

  description: {
    fontSize: 18,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 28,
  },
});