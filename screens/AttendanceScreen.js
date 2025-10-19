import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const AttendanceScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      if (!db) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'classes'));
        const classList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClasses(classList);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch classes: ' + error.message);
      }
    };
    fetchClasses();
  }, []);

  const selectClass = async (classItem) => {
    if (!db) {
      Alert.alert('Error', 'Firebase not initialized. Please check your configuration.');
      return;
    }
    setSelectedClass(classItem);
    try {
      const studentQuery = await getDocs(collection(db, 'students'));
      const allStudents = studentQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const classStudents = allStudents.filter(student => classItem.students.includes(student.id));
      setStudents(classStudents);
      const initialAttendance = {};
      classStudents.forEach(student => {
        initialAttendance[student.id] = false; // false = absent, true = present
      });
      setAttendance(initialAttendance);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch students: ' + error.message);
    }
  };

  const toggleAttendance = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const saveAttendance = async () => {
    if (!selectedClass) return;
    if (!db) {
      Alert.alert('Error', 'Firebase not initialized. Please check your configuration.');
      return;
    }
    try {
      await addDoc(collection(db, 'attendance'), {
        classId: selectedClass.id,
        date: new Date().toISOString().split('T')[0],
        records: attendance,
      });
      Alert.alert('Success', 'Attendance saved successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderClass = ({ item }) => (
    <TouchableOpacity style={styles.classItem} onPress={() => selectClass(item)}>
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderStudent = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.studentName}>{item.name} ({item.studentId})</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.attendanceButton, attendance[item.id] && styles.selectedButton]}
          onPress={() => setAttendance(prev => ({ ...prev, [item.id]: true }))}
        >
          <Text style={styles.buttonText}>Present</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.attendanceButton, !attendance[item.id] && styles.selectedButton]}
          onPress={() => setAttendance(prev => ({ ...prev, [item.id]: false }))}
        >
          <Text style={styles.buttonText}>Absent</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          {!selectedClass ? (
            <Text style={styles.title}>Select Class for Attendance</Text>
          ) : (
            <Text style={styles.title}>Mark Attendance for {selectedClass.name}</Text>
          )}
        </View>
        {!selectedClass ? (
          <FlatList
            data={classes}
            renderItem={renderClass}
            keyExtractor={item => item.id}
            style={styles.list}
            scrollEnabled={false}
          />
        ) : (
          <>
            <FlatList
              data={students}
              renderItem={renderStudent}
              keyExtractor={item => item.id}
              style={styles.list}
              scrollEnabled={false}
            />
            <TouchableOpacity style={styles.button} onPress={saveAttendance}>
              <Text style={styles.buttonText}>Save Attendance</Text>
            </TouchableOpacity>
          </>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  backButton: {
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  list: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  classItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginVertical: 5,
  },
  studentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginVertical: 5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attendanceButton: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#ff6b6b',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default AttendanceScreen;
