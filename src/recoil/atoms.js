import { useEffect } from "react";
import { atom, selector, useSetRecoilState } from 'recoil';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

// Helper for Async Storage effects in Recoil
const asyncStorageEffect = key => ({setSelf, onSet}) => {
  setSelf(AsyncStorage.getItem(key).then(savedValue =>
    savedValue != null ? JSON.parse(savedValue) : null // we'll stringify on save
  ));

  onSet((newValue, _, isReset) => {
    isReset
      ? AsyncStorage.removeItem(key)
      : AsyncStorage.setItem(key, JSON.stringify(newValue));
  });
};

// Atoms for storing state
export const companyAtom = atom({
  key: "companyAtom",
  default: "TurnOnsell"
});

export const baseURLAtom = atom({
  key: "baseURLAtom",
  default: "https://turnonsell.com/api" 
});

export const accessTokenAtom = atom({
  key: "accessTokenAtom",
  default: null,
  effects: [asyncStorageEffect('token')]
});
 
export const refreshTokenAtom = atom({
  key: "refreshTokenAtom",
  default: null,
  effects: [asyncStorageEffect('refresh')]
});

export const usernameAtom = atom({
  key: "usernameAtom",
  default: null,
  effects: [asyncStorageEffect('username')]
});

export const useremailAtom = atom({
  key: "useremailAtom",
  default: null,
  effects: [asyncStorageEffect('useremail')]
});

export const userTypeAtom = atom({
  key: "userTypeAtom",
  default: null,
  effects: [asyncStorageEffect('user_type')]
});

export const userPermissionsAtom = atom({
  key: 'userPermissionsAtom',
  default: {},
  effects: [asyncStorageEffect('user_permissions')]
});

export const userIdAtom = atom({
  key: "userIdAtom",
  default: null,
  effects: [asyncStorageEffect('user_id')]
});

export const darkModeAtom = atom({
  key: 'darkModeAtom',
  default: false,
  effects: [asyncStorageEffect('darkMode')]
});

// Since isLoggedin depends on AsyncStorage, it's better to manage it with an atom and effect
export const isLoggedinAtom = atom({
  key: 'isLoggedinAtom',
  default: false,
  effects: [
    ({setSelf, onSet}) => {
      setSelf(AsyncStorage.getItem('is_login').then(savedValue =>
        savedValue === "true"
      ));

      onSet((newValue, _, isReset) => {
        isReset
          ? AsyncStorage.removeItem('is_login')
          : AsyncStorage.setItem('is_login', newValue ? "true" : "false");
      });
    }
  ]
});

export const userVersion = atom({
  key: 'userVersion',
  default: null,
  effects: [asyncStorageEffect('version')]
});

// Helper Functions for Session Management
const updateLastActivity = async () => {
  await AsyncStorage.setItem('lastActivity', new Date().getTime().toString());
};

const isSessionExpired = async () => {
  const lastActivity = await AsyncStorage.getItem('lastActivity');
  if (!lastActivity) return false;
  return new Date().getTime() - Number(lastActivity) > SESSION_TIMEOUT;
};

// Custom Hook for logging out
export const useLogOut = () => {
  const setAccessToken = useSetRecoilState(accessTokenAtom);
  const setRefreshToken = useSetRecoilState(refreshTokenAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const setUseremail = useSetRecoilState(useremailAtom);
  const setUserType = useSetRecoilState(userTypeAtom);
  const setUserId = useSetRecoilState(userIdAtom);
  const setLoggedin = useSetRecoilState(isLoggedinAtom);
  const setUserVersion = useSetRecoilState(userVersion);

  const router = useRouter();

  const logOut = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUsername(null);
    setUserId(null);
    setUserType(null);
    setLoggedin(false);
    setUseremail(null);
    setUserVersion(null);
    
    await AsyncStorage.clear();
    await AsyncStorage.setItem("is_login", "false");
    router.replace("/login");
  };

  return logOut;
};
