import { Stack } from "expo-router";
import { Provider } from "react-redux";
import {store}  from "../store/store"; 

import { FavoritesProvider } from "../context/FavoritesContext";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <FavoritesProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </FavoritesProvider>
      </AuthProvider>
    </Provider>
  );
}