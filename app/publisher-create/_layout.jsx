import { Stack } from "expo-router";
import { ListingProvider } from "../../context/ListingContext";

export default function PublisherCreateLayout() {
  return (
    <ListingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ListingProvider>
  );
}