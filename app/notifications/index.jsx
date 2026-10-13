import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../services/notifications";

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            setLoading(true);

            const data = await getNotifications();

            setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des notifications :",
                error?.response?.data || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [])
    );

    const handleRead = async (notification) => {
        if (notification.read) {
            return;
        }

        try {
            await markNotificationAsRead(notification.id);

            setNotifications((current) =>
                current.map((item) =>
                    item.id === notification.id
                        ? { ...item, read: true }
                        : item
                )
            );
        } catch (error) {
            console.error(
                "Erreur lors de la lecture de la notification :",
                error?.response?.data || error.message
            );
        }
    };

    const handleReadAll = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((current) =>
                current.map((item) => ({
                    ...item,
                    read: true,
                }))
            );
        } catch (error) {
            console.error(
                "Erreur lors du marquage des notifications :",
                error?.response?.data || error.message
            );
        }
    };

    const unreadCount = notifications.filter(
        (notification) => !notification.read
    ).length;

    const renderNotification = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.notification,
                !item.read && styles.unreadNotification,
            ]}
            onPress={() => handleRead(item)}
            activeOpacity={0.8}
        >
            <View style={styles.iconContainer}>
                <Ionicons
                    name={
                        item.type === "VISIT"
                            ? "calendar-outline"
                            : "notifications-outline"
                    }
                    size={22}
                    color="#F59E0B"
                />
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>

                    {!item.read && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.message}>{item.message}</Text>

                {item.createdAt && (
                    <Text style={styles.date}>
                        {new Date(item.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                        })}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Header
                title="Mes notifications"
                showBack
            />

            {unreadCount > 0 && (
                <TouchableOpacity
                    style={styles.readAllButton}
                    onPress={handleReadAll}
                >
                    <Text style={styles.readAllText}>
                        Tout marquer comme lu
                    </Text>
                </TouchableOpacity>
            )}

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#F59E0B" />
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.empty}>
                    <Ionicons
                        name="notifications-off-outline"
                        size={50}
                        color="#9CA3AF"
                    />

                    <Text style={styles.emptyTitle}>
                        Aucune notification
                    </Text>

                    <Text style={styles.emptyText}>
                        Vous n'avez aucune notification pour le moment.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNotification}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF2F7",
        padding: 20,
    },

    list: {
        paddingTop: 10,
        paddingBottom: 30,
    },

    notification: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
    },

    unreadNotification: {
        borderWidth: 1,
        borderColor: "#F59E0B",
    },

    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#FEF3C7",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    content: {
        flex: 1,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },

    unreadDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#F59E0B",
        marginLeft: 8,
    },

    message: {
        fontSize: 14,
        color: "#4B5563",
        marginTop: 5,
        lineHeight: 20,
    },

    date: {
        fontSize: 12,
        color: "#9CA3AF",
        marginTop: 8,
    },

    readAllButton: {
        alignSelf: "flex-end",
        marginTop: 5,
        marginBottom: 5,
    },

    readAllText: {
        color: "#F59E0B",
        fontSize: 13,
        fontWeight: "600",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    empty: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#374151",
        marginTop: 15,
    },

    emptyText: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        marginTop: 8,
        lineHeight: 20,
    },
});

