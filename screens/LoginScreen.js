import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, setRememberMe } from '../src/store/slices/authSlice';
import { auth } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { rememberMe } = useSelector(state => state.auth);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!auth) {
      Alert.alert('Error', 'Authentication not initialized. Please check your Firebase configuration.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        navigation.navigate('Dashboard');
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
        Alert.alert('Success', 'Account created successfully! Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      if (isLogin) {
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Error', 'Wrong password.');
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'Wrong email.');
        } else if (error.code === 'auth/invalid-credential') {
          Alert.alert('Error', 'Wrong email or password.');
        } else {
          Alert.alert('Error', error.message);
        }
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
        <View style={styles.header}>
          <Text style={styles.title}>ClassTrack</Text>
          <Text style={styles.subtitle}>Teacher Portal</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Please wait...' : (isLogin ? '🔐 Login' : '📝 Sign Up')}
            </Text>
          </TouchableOpacity>
          <View style={styles.optionsContainer}>
            {isLogin && (
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Remember Me</Text>
                <Switch
                  value={rememberMe}
                  onValueChange={(value) => dispatch(setRememberMe(value))}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={rememberMe ? '#f5dd4b' : '#f4f3f4'}
                />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
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
    marginBottom: 50,
    marginTop: 50,
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
    fontSize: 20,
    color: '#e8f4f8',
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
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },

  optionsContainer: {
    marginTop: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;
