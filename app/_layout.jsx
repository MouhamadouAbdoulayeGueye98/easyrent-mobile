import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FavoritesProvider } from "../context/FavoritesContext";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
