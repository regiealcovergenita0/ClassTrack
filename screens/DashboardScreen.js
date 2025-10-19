import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const DashboardScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalAttendanceRecords: 0,
  });

  useEffect(() => {
    if (!auth) {
      Alert.alert('Error', 'Authentication not initialized. Please check your Firebase configuration.');
      navigation.replace('Login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchStats();
      } else {
        // Only navigate to Login if not already there
        if (navigation.getState().routes[navigation.getState().index].name !== 'Login') {
          navigation.replace('Login');
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const fetchStats = async () => {
    try {
      const [studentsSnap, classesSnap, attendanceSnap] = await Promise.all([
        getDocs(collection(db, 'students')),
        getDocs(collection(db, 'classes')),
        getDocs(collection(db, 'attendance')),
      ]);

      setStats({
        totalStudents: studentsSnap.size,
        totalClasses: classesSnap.size,
        totalAttendanceRecords: attendanceSnap.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.gradient}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        alwaysBounceVertical={true}
      >
        <View style={styles.header}>
          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.email}>{user.email}</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Overview</Text>
          <View style={styles.statsGrid}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </LinearGradient>
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalClasses}</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </LinearGradient>
            <LinearGradient colors={['#fa709a', '#fee140']} style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalAttendanceRecords}</Text>
              <Text style={styles.statLabel}>Attendance Records</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AddStudent')}
            >
              <Text style={styles.actionIcon}>👨‍🎓</Text>
              <Text style={styles.actionText}>Add Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('CreateClass')}
            >
              <Text style={styles.actionIcon}>📚</Text>
              <Text style={styles.actionText}>Create Class</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Attendance')}
            >
              <Text style={styles.actionIcon}>✅</Text>
              <Text style={styles.actionText}>Mark Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Summary')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View Summary</Text>
            </TouchableOpacity>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  email: {
    fontSize: 18,
    color: '#e8f4f8',
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#ff4757',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingBottom: 150,
  },
  actionsGrid: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    width: '85%',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 35,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default DashboardScreen;
