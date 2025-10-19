import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const SummaryScreen = ({ navigation }) => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!db) return;
      try {
        const attendanceQuery = await getDocs(collection(db, 'attendance'));
        const attendanceRecords = attendanceQuery.docs.map(doc => doc.data());

        const studentQuery = await getDocs(collection(db, 'students'));
        const students = studentQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const summaryData = students.map(student => {
          const studentAttendance = attendanceRecords.filter(record =>
            Object.keys(record.records).includes(student.id)
          );
          const totalDays = studentAttendance.length;
          const presentDays = studentAttendance.filter(record => record.records[student.id]).length;
          const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
          return {
            ...student,
            totalDays,
            presentDays,
            percentage,
          };
        });
        setSummary(summaryData);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      }
    };
    fetchSummary();
  }, []);

  const renderSummary = ({ item }) => (
    <View style={styles.summaryItem}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentId}>ID: {item.studentId}</Text>
      </View>
      <View style={styles.attendanceStats}>
        <Text style={styles.statsText}>Present: {item.presentDays}/{item.totalDays} days</Text>
        <Text style={[styles.percentage, getPercentageColor(item.percentage)]}>
          {item.percentage}%
        </Text>
      </View>
    </View>
  );

  const getPercentageColor = (percentage) => {
    const percent = parseFloat(percentage);
    if (percent >= 80) return styles.excellent;
    if (percent >= 60) return styles.good;
    if (percent >= 40) return styles.average;
    return styles.poor;
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>📊 Attendance Summary</Text>
          <Text style={styles.subtitle}>Overall attendance statistics for all students</Text>
        </View>
        <View style={styles.summaryContainer}>
          <FlatList
            data={summary}
            renderItem={renderSummary}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
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
  summaryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginVertical: 5,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
  attendanceStats: {
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  percentage: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  excellent: {
    color: '#28a745',
  },
  good: {
    color: '#17a2b8',
  },
  average: {
    color: '#ffc107',
  },
  poor: {
    color: '#dc3545',
  },
});

export default SummaryScreen;
