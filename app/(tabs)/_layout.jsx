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
          marginBottom: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarActiveTintColor: "#10B981",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={focused ? "#10B981" : "#10B981"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Carte",
          tabBarActiveTintColor: "#F59E0B",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={size}
              color={focused ? "#F59E0B" : "#F59E0B"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoris",
          tabBarActiveTintColor: "#EF4444",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={focused ? "#EF4444" : "#EF4444"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarActiveTintColor: "#8B5CF6",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={size}
              color={focused ? "#8B5CF6" : "#8B5CF6"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarActiveTintColor: "#EC4899",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={focused ? "#EC4899" : "#EC4899"}
            />
          ),
        }}
      />
    </Tabs>
  );
}