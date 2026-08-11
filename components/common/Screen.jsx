import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export default function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.container, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});