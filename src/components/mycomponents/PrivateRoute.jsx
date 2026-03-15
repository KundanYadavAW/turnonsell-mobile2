import React from 'react';
import { View, Text } from 'react-native';

// In React Native Navigation, PrivateRoute logic is typically handled in the 
// Navigator itself by rendering different screen groups based on auth state (as we did in App.js).
// So this file is mostly kept to satisfy the original structural requirement 
// if you ever need to wrap individual components with specific hoc logic.

const PrivateRoute = ({ children }) => {
  return <>{children}</>;
};

export default PrivateRoute;

