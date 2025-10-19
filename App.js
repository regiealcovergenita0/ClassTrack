import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddStudentScreen from './screens/AddStudentScreen';
import CreateClassScreen from './screens/CreateClassScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import SummaryScreen from './screens/SummaryScreen';
import ErrorBoundary from './src/components/ErrorBoundary';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="AddStudent" component={AddStudentScreen} />
              <Stack.Screen name="CreateClass" component={CreateClassScreen} />
              <Stack.Screen name="Attendance" component={AttendanceScreen} />
              <Stack.Screen name="Summary" component={SummaryScreen} />
            </Stack.Navigator>
            <StatusBar style="auto" />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
