import { FlatList, StyleSheet, View } from "react-native";

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";

import GuestScreen from "../../components/common/GuestScreen";
import { conversations } from "../../constants/conversations";

import ConversationCard from "../../components/messages/ConversationCard";

export default function Messages() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Header title="Messages" />

        <GuestScreen
          icon="chatbubble-outline"
          title="Discutez avec les annonceurs"
          description="Connectez-vous pour contacter les propriétaires et retrouver vos conversations."
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header title="Messages" rightIcon="create-outline" />

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ConversationCard conversation={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 40,
  },

  list: {
    padding: 20,
    paddingBottom: 40,
  },
});
