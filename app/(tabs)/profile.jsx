import { ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router"; 

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import GuestScreen from "../../components/common/GuestScreen";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileMenuItem from "../../components/profile/ProfileMenuItem";

export default function Profile() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    // router.replace("(tabs)");
  } 

  if (!user) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <GuestScreen
          icon="person-circle-outline"
          title="Bienvenue sur EasyRent"
          description="Connectez-vous pour retrouver vos favoris, réserver des visites, discuter avec les annonceurs et publier vos logements."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header title="Mon profil" />

      <ProfileHeader />

      <ProfileMenuItem 
        icon="heart" 
        title="Mes favoris" 
        onPress={() => router.push("/favorites")} 
      />

      <ProfileMenuItem 
        icon="calendar" 
        title="Mes visites" 
        onPress={() => router.push("/requests")} 
      />

      <ProfileMenuItem 
        icon="chatbubble" 
        title="Mes messages" 
        onPress={() => router.push("/messages")} 
      />

      <ProfileMenuItem 
        icon="settings" 
        title="Paramètres" 
        onPress={() => router.push("/settings")} 
      />

      <ProfileMenuItem 
        icon="help-circle" 
        title="Aide" 
      />

      <ProfileMenuItem
        icon="log-out"
        title="Déconnexion"
        color="#EF4444"
        onPress={handleLogout}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "#EEF2F7",
    padding: 20,
  },
});