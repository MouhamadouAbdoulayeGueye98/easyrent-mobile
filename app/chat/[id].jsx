
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState, useEffect } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import {
  getMessages,
  sendMessage as sendMessageApi,
} from "../../services/conversations";

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
      const interval = setInterval(load, 4000);

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

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    } catch (error) {
      console.error("Erreur envoi message :", error);
      setText(content);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <Header title="Discussion" showBack />

      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={chatMessages}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item }) => {
          const isMine = String(item.senderId) === String(user?.id);

          return (
            <View
              style={[
                styles.message,
                isMine ? styles.myMessage : styles.otherMessage,
              ]}
            >
              <Text style={[styles.messageText, isMine && styles.myText]}>
                {item.content}
              </Text>

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

      <View
        style={[
          styles.inputContainer,
          keyboardVisible && styles.inputContainerKeyboard,
        ]}
      >
        <TextInput
          ref={inputRef}
          placeholder="Écrire un message..."
          placeholderTextColor="#6B7280"
          value={text}
          onChangeText={setText}
          style={styles.input}
          multiline
          maxLength={2000}
          blurOnSubmit={false}
          returnKeyType="default"
          textAlignVertical="center"
        />

        <TouchableOpacity
          style={[styles.sendButton, sending && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={sending || !text.trim()}
          accessibilityLabel="Envoyer le message"
          accessibilityRole="button"
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2F7",
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2F7",
  },
  list: {
    flex: 1,
  },
  messages: {
    padding: 20,
    paddingBottom: 16,
    flexGrow: 1,
  },
  message: {
    maxWidth: "80%",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
  },
  myMessage: {
    backgroundColor: "#2563EB",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#111827",
    fontSize: 16,
    lineHeight: 22,
  },
  myText: {
    color: "#FFFFFF",
  },
  time: {
    marginTop: 6,
    fontSize: 11,
    color: "#6B7280",
    alignSelf: "flex-end",
  },
  myTime: {
    color: "#DBEAFE",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: Platform.OS === "android" ? 12 : 15,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  inputContainerKeyboard: {
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
    maxHeight: 100,
    minHeight: 48,
  },
  sendButton: {
    marginLeft: 10,
    marginBottom: 1,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
