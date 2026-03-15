import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper to initialize state from AsyncStorage
const getInitialState = async (key, defaultValue) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // is_login is stored as "true" / "false" strings
      if (key === 'is_login') return value === 'true';
      // darkMode might be string "true"/"false" or boolean stringified
      if (key === 'darkMode') return value === 'true' || value === true;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value; // fallback for plain strings
      }
    }
  } catch (error) {
    console.error(`Error reading ${key} from AsyncStorage`, error);
  }
  return defaultValue;
};

// Create a custom set function that also syncs to AsyncStorage
const createStorageSetter = (set) => (key, value, stateKey) => {
  set({ [stateKey]: value });
  
  if (value === null || value === undefined) {
    AsyncStorage.removeItem(key).catch(console.error);
  } else {
    // Handle specific string conversions
    let storageValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (key === 'is_login' || key === 'darkMode') {
      storageValue = value ? 'true' : 'false';
    }
    AsyncStorage.setItem(key, storageValue).catch(console.error);
  }
};

export const useStore = create((set, get) => ({
  // State
  company: "TurnOnsell",
  baseURL: "https://turnonsell.com/api",
  
  accessToken: null,
  refreshToken: null,
  username: null,
  useremail: null,
  userType: null,
  userPermissions: {},
  userId: null,
  darkMode: false,
  isLoggedin: false,
  userVersion: null,
  
  // Initialization Status
  isHydrated: false,
  
  // Setters
  setAccessToken: (token) => createStorageSetter(set)('token', token, 'accessToken'),
  setRefreshToken: (token) => createStorageSetter(set)('refresh', token, 'refreshToken'),
  setUsername: (name) => createStorageSetter(set)('username', name, 'username'),
  setUseremail: (email) => createStorageSetter(set)('useremail', email, 'useremail'),
  setUserType: (type) => createStorageSetter(set)('user_type', type, 'userType'),
  setUserPermissions: (perms) => createStorageSetter(set)('user_permissions', perms, 'userPermissions'),
  setUserId: (id) => createStorageSetter(set)('user_id', id, 'userId'),
  setDarkMode: (isDark) => createStorageSetter(set)('darkMode', isDark, 'darkMode'),
  setIsLoggedin: (isLogged) => createStorageSetter(set)('is_login', isLogged, 'isLoggedin'),
  setUserVersion: (version) => createStorageSetter(set)('version', version, 'userVersion'),
  
  // Hydrate Store from AsyncStorage
  hydrate: async () => {
    const accessToken = await getInitialState('token', null);
    const refreshToken = await getInitialState('refresh', null);
    const username = await getInitialState('username', null);
    const useremail = await getInitialState('useremail', null);
    const userType = await getInitialState('user_type', null);
    const userPermissions = await getInitialState('user_permissions', {});
    const userId = await getInitialState('user_id', null);
    const darkMode = await getInitialState('darkMode', false);
    const isLoggedin = await getInitialState('is_login', false);
    const userVersion = await getInitialState('version', null);
    
    set({
      accessToken,
      refreshToken,
      username,
      useremail,
      userType,
      userPermissions,
      userId,
      darkMode,
      isLoggedin,
      userVersion,
      isHydrated: true,
    });
  },
  
  // LogOut Action
  logOut: async () => {
    set({
      accessToken: null,
      refreshToken: null,
      username: null,
      userId: null,
      userType: null,
      isLoggedin: false,
      useremail: null,
      userVersion: null
    });
    
    await AsyncStorage.clear();
    await AsyncStorage.setItem("is_login", "false");
  }
}));
