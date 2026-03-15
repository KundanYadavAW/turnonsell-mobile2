import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../../src/zustand/store';
import Icon from 'react-native-vector-icons/MaterialIcons';



const { width } = Dimensions.get('window');

const CategoryButtons = () => {
  const navigation = useNavigation();
  const darkMode = useStore((state) => state.darkMode);
  const isDark = darkMode === true || darkMode === "true";

  const handleCategoryClick = (category) => {
    const routes = {
      books: "SearchPost",          // Assuming SearchPost is the screen name in routing
      clothes: "SearchClothPost",
      electronics: "SearchStationaryPost", // Mapped to Stationary in web project
      footwear: "SearchFootwearPost"
    };
    if (routes[category]) {
      navigation.navigate(routes[category]);
    }
  };

  const categories = [
    {
      id: 'books',
      label: 'Books',
      iconName: 'menu-book',
      bgColor: '#6366f1',
    },
    {
      id: 'clothes',
      label: 'Clothes',
      iconName: 'checkroom',
      bgColor: '#ec4899',
    },
    {
      id: 'electronics',
      label: 'Electronics',
      iconName: 'devices',
      bgColor: '#14b8a6',
    },
    {
      id: 'footwear',
      label: 'Footwear',
      iconName: 'directions-run',
      bgColor: '#f97316',
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f8f9fa' }]}>
      <View style={styles.iconRow}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryWrap}
            activeOpacity={0.7}
            onPress={() => handleCategoryClick(category.id)}
          >
            <View style={[styles.circle, { backgroundColor: category.bgColor }]}>
              <Icon name={category.iconName} size={30} color="#fff" />
            </View>
            <Text style={[styles.label, { color: isDark ? '#ccc' : '#495057' }]} numberOfLines={1}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  categoryWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: width < 360 ? 65 : 80,
  },
  circle: {
    width: width < 360 ? 50 : 64,
    height: width < 360 ? 50 : 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: width < 360 ? 10 : 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  }
});

export default CategoryButtons;




