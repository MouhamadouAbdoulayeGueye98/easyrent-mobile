import { View } from "react-native";
import ScreenHeader from "../../components/common/ScreenHeader";

export default function Search() {
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Recherche"
        subtitle="Trouvez rapidement un logement."
      />
    </View>
  );
}