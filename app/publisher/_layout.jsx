
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

const COLORS = {
  primary: "#1749A6",
  primaryDark: "#10377E",
  muted: "#8994A8",
  background: "#FFFFFF",
  activeBackground: "#EAF1FF",
  border: "#E7ECF4",
};

function TabIcon({ name, focused }) {
  return (
    <View
      style={[
        styles.iconContainer,
        focused && styles.iconContainerActive,
      ]}
    >
      <Ionicons
        name={name}
        size={22}
        color={focused ? COLORS.primary : COLORS.muted}
      />
    </View>
  );
}

export default function PublisherLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,

        tabBarStyle: styles.tabBar,

        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={
                focused
                  ? "grid"
                  : "grid-outline"
              }
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: "Demandes",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={
                focused
                  ? "calendar"
                  : "calendar-outline"
              }
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="listings"
        options={{
          title: "Annonces",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={
                focused
                  ? "business"
                  : "business-outline"
              }
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={
                focused
                  ? "chatbubbles"
                  : "chatbubbles-outline"
              }
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={
                focused
                  ? "person"
                  : "person-outline"
              }
              focused={focused}
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

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    height: 72,
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 4,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderRadius: 22,
    elevation: 10,
    shadowColor: "#172033",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  tabBarItem: {
    paddingVertical: 0,
  },

  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1,
  },

  iconContainer: {
    width: 42,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerActive: {
    backgroundColor: COLORS.activeBackground,
  },
});
