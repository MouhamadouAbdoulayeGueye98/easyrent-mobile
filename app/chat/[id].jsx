import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import { getMessages, sendMessage as sendMessageApi } from "../../services/conversations";

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function load() {
        try {
          const data = await getMessages(id);
          if (isActive) {
            setChatMessages(data);
            setLoading(false);
          }
        } catch (error) {
          console.error("Erreur chargement messages :", error);
          if (isActive) setLoading(false);
        }
      }

      load();
      const interval = setInterval(load, 4000); // simule le temps réel

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [id])
  );

  async function handleSend() {
    const content = text.trim();
    if (!content || sending) return;

    setText("");
    setSending(true);

    try {
      const newMessage = await sendMessageApi(id, content);
      setChatMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Erreur envoi message :", error);
      setText(content); // on remet le texte si l'envoi échoue
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Discussion" showBack />

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMine = item.senderId === user?.id;
          return (
            <View style={[styles.message, isMine ? styles.myMessage : styles.otherMessage]}>
              <Text style={[styles.text, isMine && styles.myText]}>{item.content}</Text>
              <Text style={[styles.time, isMine && styles.myTime]}>
                {new Date(item.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Écrire un message..."
          value={text}
          onChangeText={setText}
          style={styles.input}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEF2F7", paddingTop: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EEF2F7" },
  messages: { padding: 20, paddingBottom: 30 },
  message: { maxWidth: "80%", padding: 14, borderRadius: 18, marginBottom: 12 },
  myMessage: { backgroundColor: "#2563EB", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#FFFFFF", alignSelf: "flex-start" },
  text: { color: "#111827", fontSize: 16, lineHeight: 22 },
  myText: { color: "#FFFFFF" },
  time: { marginTop: 6, fontSize: 11, color: "#6B7280", alignSelf: "flex-end" },
  myTime: { color: "#DBEAFE" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
});