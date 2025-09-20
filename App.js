import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function App() {
  // Chat messages with reply
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: 'other', replies: [] },
    { id: '2', text: 'Hi! How are you', sender: 'me', replies: [] },
    { id: '3', text: 'I’m okay love!', sender: 'other', replies: [] },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [replyChatId, setReplyChatId] = useState(null);

  // Comments (no reply, only simple posts)
  const [comments, setComments] = useState([
    { id: '1', text: 'This is a nice app!' },
    { id: '2', text: 'Wow! Great job ❤️' },
  ]);
  const [commentInput, setCommentInput] = useState('');

  // Chat send/reply
  const sendMessage = () => {
    if (chatInput.trim() === '') return;

    if (replyChatId) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === replyChatId
            ? {
                ...msg,
                replies: [...msg.replies, { id: Date.now().toString(), text: chatInput }],
              }
            : msg
        )
      );
      setReplyChatId(null);
    } else {
      const newMessage = {
        id: Date.now().toString(),
        text: chatInput,
        sender: 'me',
        replies: [],
      };
      setMessages([...messages, newMessage]);
    }
    setChatInput('');
  };

  // Add comment (no reply)
  const addComment = () => {
    if (commentInput.trim() === '') return;
    const newComment = {
      id: Date.now().toString(),
      text: commentInput,
    };
    setComments([...comments, newComment]);
    setCommentInput('');
  };

  // Render chat messages
  const renderChat = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <View
        style={[
          styles.message,
          item.sender === 'me' ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>

      {item.replies.length > 0 && (
        <View style={styles.replyContainer}>
          {item.replies.map((r) => (
            <Text key={r.id} style={styles.replyText}>
              ↪ {r.text}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={() => setReplyChatId(item.id)}>
        <Text style={styles.replyButton}>Reply</Text>
      </TouchableOpacity>
    </View>
  );

  // Render comments (no reply button)
  const renderComment = ({ item }) => (
    <View style={styles.commentBox}>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.sectionTitle}>💬 Chatbox</Text>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderChat}
          contentContainerStyle={styles.chatContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={replyChatId ? 'Replying...' : 'Type a message...'}
            value={chatInput}
            onChangeText={setChatInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendText}>{replyChatId ? 'Reply' : 'Send'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>📝 Comments</Text>
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderComment}
          contentContainerStyle={styles.commentContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={commentInput}
            onChangeText={setCommentInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={addComment}>
            <Text style={styles.sendText}>Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  chatContainer: { padding: 10 },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#EEE',
    alignSelf: 'flex-start',
  },
  messageText: { fontSize: 16 },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendText: { color: '#fff', fontWeight: 'bold' },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
margin: 10,
  },
  commentContainer: { padding: 10 },
  commentBox: {
    backgroundColor: '#f1f1f1',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  commentText: { fontSize: 15 },

  replyContainer: { marginLeft: 20, marginTop: 4 },
  replyText: { fontSize: 14, color: '#555' },
  replyButton: { fontSize: 13, color: '#007AFF', marginTop: 3 },
});

