import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>ClassTrack</Text>
          <Text style={styles.subtitle}>Manage your classroom attendance effortlessly</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => navigation.navigate('AddStudent')}>
            <Text style={styles.buttonText}>➕ Add Student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.createButton]} onPress={() => navigation.navigate('CreateClass')}>
            <Text style={styles.buttonText}>📚 Create Class</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.attendanceButton]} onPress={() => navigation.navigate('Attendance')}>
            <Text style={styles.buttonText}>✅ Mark Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.summaryButton]} onPress={() => navigation.navigate('Summary')}>
            <Text style={styles.buttonText}>📊 Attendance Summary</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 40,
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
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    padding: 18,
    borderRadius: 15,
    marginVertical: 8,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
  },
  createButton: {
    backgroundColor: '#007bff',
  },
  attendanceButton: {
    backgroundColor: '#ffc107',
  },
  summaryButton: {
    backgroundColor: '#6f42c1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
