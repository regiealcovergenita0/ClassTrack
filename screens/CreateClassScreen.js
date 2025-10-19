import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const CreateClassScreen = ({ navigation }) => {
  const [className, setClassName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!db) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const studentList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch students: ' + error.message);
      }
    };
    fetchStudents();
  }, []);

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const createClass = async () => {
    if (!className.trim() || selectedStudents.length === 0) {
      Alert.alert('Error', 'Please enter class name and select at least one student');
      return;
    }
    if (!db) {
      Alert.alert('Error', 'Firebase not initialized. Please check your configuration.');
      return;
    }
    try {
      await addDoc(collection(db, 'classes'), {
        name: className.trim(),
        students: selectedStudents,
      });
      Alert.alert('Success', 'Class created successfully');
      setClassName('');
      setSelectedStudents([]);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      style={[styles.studentItem, selectedStudents.includes(item.id) && styles.selected]}
      onPress={() => toggleStudentSelection(item.id)}
    >
      <Text style={styles.studentName}>{item.name} ({item.studentId})</Text>
      {selectedStudents.includes(item.id) && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>📚 Create New Class</Text>
          <Text style={styles.subtitle}>Name your class and select students to include</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Class Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter class name"
              value={className}
              onChangeText={setClassName}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.studentSection}>
            <Text style={styles.subtitle}>Select Students ({selectedStudents.length} selected)</Text>
            <FlatList
              data={students}
              renderItem={renderStudent}
              keyExtractor={item => item.id}
              style={styles.list}
              scrollEnabled={false}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={createClass}>
            <Text style={styles.buttonText}>📚 Create Class</Text>
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
  studentSection: {
    marginBottom: 20,
  },
  list: {
    maxHeight: 300,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  studentName: {
    fontSize: 16,
    color: '#333',
  },
  selected: {
    backgroundColor: '#e8f5e8',
  },
  checkmark: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: 'bold',
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

export default CreateClassScreen;
