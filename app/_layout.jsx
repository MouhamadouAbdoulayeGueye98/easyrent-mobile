import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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

            {/* Affichage global des notifications Toast */}
            <Toast />
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}