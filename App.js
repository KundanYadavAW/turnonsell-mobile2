import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useStore } from './src/zustand/store';
import Login from './src/components/pages/Login';
import GetData from './src/components/pages/GetData';
import PrivateRoute from './src/components/mycomponents/PrivateRoute';
import Layout from './src/components/mycomponents/Layout';
// Mock elements that we will port later
import SignUp from './src/components/pages/SignUp';

const Stack = createNativeStackNavigator();

function NavigationScreens() {
  const isLoggedin = useStore((state) => state.isLoggedin);
  const darkMode = useStore((state) => state.darkMode);
  const isHydrated = useStore((state) => state.isHydrated);
  const hydrate = useStore((state) => state.hydrate);

  useEffect(() => {
    // Hydrate zustand store from AsyncStorage on mount
    hydrate();
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      {!isLoggedin ? (
        // Unauthenticated Flow
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="ResetPassword" component={require('./src/components/pages/ResetPassword').default} />
        </Stack.Navigator>
      ) : (
        // Authenticated Flow
        <Layout>
          <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="Main" component={GetData} />
            <Stack.Screen name="BookPostDetails" component={require('./src/components/pages/BookPostDetails').default} />
            <Stack.Screen name="ClothPostDetails" component={require('./src/components/pages/ClothPostDetails').default} />
            <Stack.Screen name="DetailsStationary" component={require('./src/components/pages/DetailsStationary').default} />
            <Stack.Screen name="FootwearPostDetails" component={require('./src/components/pages/FootwearPostDetails').default} />
            <Stack.Screen name="SearchPost" component={require('./src/components/pages/SearchPost').default} />
            <Stack.Screen name="SearchClothPost" component={require('./src/components/pages/SearchClothPost').default} />
            <Stack.Screen name="SearchStationaryPost" component={require('./src/components/pages/SearchStationaryPost').default} />
            <Stack.Screen name="SearchFootwearPost" component={require('./src/components/pages/SearchFootwearPost').default} />
            
            {/* User Profile, Settings, Uploads, & Edit Posts */}
            <Stack.Screen name="Profile" component={require('./src/components/pages/Profile').default} />
            <Stack.Screen name="ProfileUser" component={require('./src/components/pages/ProfileUser').default} />
            <Stack.Screen name="Setting" component={require('./src/components/pages/Setting').default} />
            <Stack.Screen name="ChangePassword" component={require('./src/components/pages/ChangePassword').default} />
            <Stack.Screen name="UploadForm" component={require('./src/components/pages/UploadForm').default} />
            <Stack.Screen name="UploadClothForm" component={require('./src/components/pages/UploadClothForm').default} />
            <Stack.Screen name="UploadFootwearForm" component={require('./src/components/pages/UploadFootwearForm').default} />
            <Stack.Screen name="UploadStationaryForm" component={require('./src/components/pages/UploadStationaryForm').default} />
            <Stack.Screen name="EditProfile" component={require('./src/components/pages/EditProfile').default} />
            <Stack.Screen name="PrivacyPolicy" component={require('./src/components/pages/PrivacyPolicy').default} />
            <Stack.Screen name="EditPost" component={require('./src/components/pages/EditPost').default} />
            <Stack.Screen name="EditClothPost" component={require('./src/components/pages/EditClothPost').default} />
            <Stack.Screen name="EditFootwear" component={require('./src/components/pages/EditFootwear').default} />
            <Stack.Screen name="EditStationary" component={require('./src/components/pages/EditStationary').default} />
            
            {/* Admin Screens */}
            <Stack.Screen name="GetAllData" component={require('./src/components/pages/GetAllData').default} />
            <Stack.Screen name="Ads" component={require('./src/components/pages/Ads').default} />
            <Stack.Screen name="EditCollegeData" component={require('./src/components/pages/EditCollegeData').default} />
            <Stack.Screen name="EditDegreeData" component={require('./src/components/pages/EditDegreeData').default} />
            <Stack.Screen name="EditYearData" component={require('./src/components/pages/EditYearData').default} />
            <Stack.Screen name="CategorySubcategoryAdmin" component={require('./src/components/pages/CategorySubcategoryAdmin').default} />
          </Stack.Navigator>
        </Layout>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <NavigationScreens />
  );
}
