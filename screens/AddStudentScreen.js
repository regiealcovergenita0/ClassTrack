import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AddStudentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');

  const addStudent = async () => {
    if (!name.trim() || !studentId.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (!db) {
      Alert.alert('Error', 'Firebase not initialized. Please check your configuration.');
      return;
    }
    try {
      await addDoc(collection(db, 'students'), {
        name: name.trim(),
        studentId: studentId.trim(),
      });
      Alert.alert('Success', 'Student added successfully');
      setName('');
      setStudentId('');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>👨‍🎓 Add New Student</Text>
          <Text style={styles.subtitle}>Enter student details to add them to the system</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter student ID"
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={addStudent}>
            <Text style={styles.buttonText}>➕ Add Student</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#e8f4f8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#ff6b6b',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AddStudentScreen;
