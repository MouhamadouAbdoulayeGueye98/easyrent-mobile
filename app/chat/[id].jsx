import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";

import Header from "../../components/common/Header";
import { messages } from "../../constants/messages";

export default function Chat() {
  const [chatMessages, setChatMessages] = useState(messages);
  const [text, setText] = useState("");

  const flatListRef = useRef(null);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({
      animated: true,
    });
  }, [chatMessages]);

  function sendMessage() {
    if (!text.trim()) return;

    const now = new Date();

    const newMessage = {
      id: Date.now().toString(),
      sender: "me",
      text: text.trim(),
      time:
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0"),
    };

    setChatMessages((prev) => [...prev, newMessage]);

    setText("");
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
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "me"
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            <Text
              style={[
                styles.text,
                item.sender === "me" && styles.myText,
              ]}
            >
              {item.text}
            </Text>

            <Text
              style={[
                styles.time,
                item.sender === "me" && styles.myTime,
              ]}
            >
              {item.time}
            </Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Écrire un message..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Ionicons
            name="send"
            size={20}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF2F7",
    paddingTop: 40,
  },

  messages: {
    padding: 20,
    paddingBottom: 30,
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

  text: {
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