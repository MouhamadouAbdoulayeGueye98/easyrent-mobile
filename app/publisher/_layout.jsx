import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function PublisherLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 8,
          marginBottom: 20,
        },

        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarActiveTintColor: "#60A5FA",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={size}
              color={focused ? "#3f92f7" : "#60A5FA"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: "Demandes",
          tabBarActiveTintColor: "#C4B5FD",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={focused ? "#8B5CF6" : "#C4B5FD"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="listings"
        options={{
          title: "Annonces",
          tabBarActiveTintColor: "#6EE7B7",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={focused ? "#10B981" : "#6EE7B7"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarActiveTintColor: "#FCA5A5",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={size}
              color={focused ? "#EF4444" : "#FCA5A5"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarActiveTintColor: "#7DD3FC",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={focused ? "#0EA5E9" : "#7DD3FC"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}