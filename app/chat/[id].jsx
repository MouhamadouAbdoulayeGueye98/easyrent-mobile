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
  StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useCallback, useRef, useState } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

import Header from "../../components/common/Header";
import { useAuth } from "../../context/AuthContext";
import {
  getMessages,
  sendMessage as sendMessageApi,
} from "../../services/conversations";

const COLORS = {
  primary: "#1749A6",
  primaryLight: "#EAF1FF",
  background: "#F5F7FB",
  white: "#FFFFFF",
  text: "#172033",
  secondary: "#718096",
  border: "#E7ECF3",
  bubbleReceived: "#FFFFFF",
  timeSent: "#DCE8FF",
  success: "#16A34A",
};

const formatTime = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date) => {
  if (!date) return "";

  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isToday =
    messageDate.toDateString() === today.toDateString();

  const isYesterday =
    messageDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Aujourd'hui";
  if (isYesterday) return "Hier";

  return messageDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;

  return (
    new Date(dateA).toDateString() ===
    new Date(dateB).toDateString()
  );
};

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const conversationId = Array.isArray(id) ? id[0] : id;

  const [chatMessages, setChatMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const flatListRef = useRef(null);
  const inputRef = useRef(null);

  // Chargement et actualisation des messages
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      let isLoading = false;

      async function load() {
        if (!conversationId || isLoading) return;

        isLoading = true;

        try {
          const data = await getMessages(conversationId);

          if (isActive) {
            setChatMessages(data);
            setError(false);
          }
        } catch (err) {
          console.error("Erreur chargement messages :", err);

          if (isActive) {
            setError(true);
          }
        } finally {
          isLoading = false;

          if (isActive) {
            setLoading(false);
          }
        }
      }

      setLoading(true);
      load();

      const interval = setInterval(load, 4000);

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    }, [conversationId])
  );

  // Envoi d'un message
  async function handleSend() {
    const content = text.trim();

    if (!content || sending || !conversationId) return;

    setText("");
    setSending(true);

    try {
      const newMessage = await sendMessageApi(
        conversationId,
        content
      );

      setChatMessages((previous) => {
        if (previous.some((item) => item.id === newMessage.id)) {
          return previous;
        }

        return [...previous, newMessage];
      });

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      });
    } catch (err) {
      console.error("Erreur envoi message :", err);
      setText(content);
    } finally {
      setSending(false);
    }
  }

  // Affichage d'un message
  const renderMessage = ({ item, index }) => {
    const isMine =
      String(item.senderId) === String(user?.id);

    const previousMessage = chatMessages[index - 1];

    const showDate =
      index === 0 ||
      !isSameDay(
        item.createdAt,
        previousMessage?.createdAt
      );

    return (
      <View>
        {showDate && (
          <View style={styles.dateContainer}>
            <View style={styles.dateLine} />
            <Text style={styles.dateText}>
              {formatDate(item.createdAt)}
            </Text>
            <View style={styles.dateLine} />
          </View>
        )}

        <View
          style={[
            styles.messageRow,
            isMine
              ? styles.myMessageRow
              : styles.otherMessageRow,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isMine
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMine && styles.myMessageText,
              ]}
            >
              {item.content}
            </Text>

            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.messageTime,
                  isMine && styles.myMessageTime,
                ]}
              >
                {formatTime(item.createdAt)}
              </Text>

              {isMine && (
                <Ionicons
                  name="checkmark"
                  size={15}
                  color={COLORS.timeSent}
                  style={styles.sentIcon}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  // État de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        <Header title="Discussion" showBack />

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Chargement de la conversation...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <Header title="Discussion" showBack />

      {/* Zone des messages */}
      {error && chatMessages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="cloud-offline-outline"
              size={34}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.emptyTitle}>
            Impossible de charger les messages
          </Text>

          <Text style={styles.emptyDescription}>
            Vérifiez votre connexion puis réessayez.
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={async () => {
              setLoading(true);

              try {
                const data = await getMessages(conversationId);
                setChatMessages(data);
                setError(false);
              } catch (err) {
                console.error(err);
                setError(true);
              } finally {
                setLoading(false);
              }
            }}
          >
            <Text style={styles.retryButtonText}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          style={styles.list}
          data={chatMessages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.messagesContainer,
            chatMessages.length === 0 &&
              styles.emptyListContent,
          ]}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({
              animated: true,
            });
          }}
          ListEmptyComponent={
            <View style={styles.emptyMessages}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={34}
                  color={COLORS.primary}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Votre conversation commence ici
              </Text>

              <Text style={styles.emptyDescription}>
                Envoyez votre premier message pour échanger
                avec votre interlocuteur.
              </Text>
            </View>
          }
        />
      )}

      {/* Barre de saisie */}
      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            placeholder="Écrire un message..."
            placeholderTextColor="#9AA4B2"
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
            style={[
              styles.sendButton,
              (!text.trim() || sending) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={sending || !text.trim()}
            activeOpacity={0.8}
            accessibilityLabel="Envoyer le message"
            accessibilityRole="button"
          >
            {sending ? (
              <ActivityIndicator
                size="small"
                color={COLORS.white}
              />
            ) : (
              <Ionicons
                name="send"
                size={19}
                color={COLORS.white}
              />
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.inputHint}>
          Appuyez sur envoyer pour transmettre votre message
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingTop: 40,
  },

  loadingText: {
    marginTop: 14,
    color: COLORS.secondary,
    fontSize: 13,
  },

  list: {
    flex: 1,
  },

  messagesContainer: {
    paddingHorizontal: 17,
    paddingTop: 20,
    paddingBottom: 25,
    flexGrow: 1,
  },

  emptyListContent: {
    justifyContent: "center",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    gap: 10,
  },

  dateLine: {
    height: 1,
    flex: 1,
    backgroundColor: COLORS.border,
  },

  dateText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: "600",
    backgroundColor: "#E9EDF4",
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: "hidden",
  },

  messageRow: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 12,
  },

  myMessageRow: {
    justifyContent: "flex-end",
  },

  otherMessageRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "82%",
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 9,
    borderRadius: 18,
  },

  myMessage: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 5,
  },

  otherMessage: {
    backgroundColor: COLORS.bubbleReceived,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  messageText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },

  myMessageText: {
    color: COLORS.white,
  },

  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 7,
  },

  messageTime: {
    fontSize: 10,
    color: COLORS.secondary,
  },

  myMessageTime: {
    color: "#DCE8FF",
  },

  sentIcon: {
    marginLeft: 3,
  },

  inputArea: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: Platform.OS === "android" ? 12 : 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#F3F6FA",
    borderRadius: 27,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 5,
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 21,
    paddingVertical: 9,
    paddingRight: 8,
    maxHeight: 110,
    minHeight: 42,
  },

  sendButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginBottom: 1,
  },

  sendButtonDisabled: {
    opacity: 0.45,
  },

  inputHint: {
    color: "#A0A9B7",
    fontSize: 10,
    textAlign: "center",
    marginTop: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  emptyMessages: {
    alignItems: "center",
    paddingHorizontal: 25,
  },

  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },

  emptyDescription: {
    color: COLORS.secondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },

  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  retryButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 13,
  },
});