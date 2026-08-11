import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";


export default function TabsLayout() {
  return (
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: "#9CA3AF",

          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0,
            elevation: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Accueil",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={focused ? "#2563EB" : "#10B981"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: "Recherche",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={focused ? "search" : "search-outline"}
                size={size}
                color={focused ? "#2563EB" : "#F59E0B"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favoris",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={size}
                color={focused ? "#EF4444" : "#F97316"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={focused ? "chatbubble" : "chatbubble-outline"}
                size={size}
                color={focused ? "#2563EB" : "#8B5CF6"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={focused ? "#2563EB" : "#EC4899"}
              />
            ),
          }}
        />
      </Tabs>
  );
}