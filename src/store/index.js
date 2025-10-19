import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import studentsReducer from './slices/studentsSlice';
import classesReducer from './slices/classesSlice';
import attendanceReducer from './slices/attendanceSlice';
import themeReducer from './slices/themeSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'theme'], // Only persist auth and theme
};

const rootReducer = combineReducers({
  auth: authReducer,
  students: studentsReducer,
  classes: classesReducer,
  attendance: attendanceReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

// Types for TypeScript (remove if not using TS)
export const RootState = store.getState;
export const AppDispatch = store.dispatch;
