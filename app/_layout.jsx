import { Stack } from "expo-router";

import { FavoritesProvider } from "../context/FavoritesContext";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </FavoritesProvider>
    </AuthProvider>
  );
}