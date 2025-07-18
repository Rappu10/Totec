import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SensoresScreen from '../screens/SensoresScreen';
import AboutScreen from '../screens/AboutScreen';
import MapScreen from '../screens/MapScreen';
import ReportsScreen from '../screens/ReportsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator({ role, onLogout }) {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerStyle: { backgroundColor: 'rgba(12, 11, 10, 1)' },
        drawerActiveTintColor: '#E9ECF0',
        drawerInactiveTintColor: '#7A7A7A',
        drawerItemStyle: { borderBottomWidth: 0.3, borderBottomColor: '#333' },
        drawerIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'About':
              iconName = focused ? 'information-circle' : 'information-circle-outline';
              break;
            case 'Sensores':
              iconName = focused ? 'speedometer' : 'speedometer-outline';
              break;
            case 'Mapa':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Reportes':
              iconName = focused ? 'document' : 'document-outline';
              break;
            default:
              iconName = 'alert-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Todos ven Home y About */}
      <Drawer.Screen name="Home">
        {() => <HomeScreen onLogout={onLogout} />}
      </Drawer.Screen>
      <Drawer.Screen name="About" component={AboutScreen} />

      {/* Solo admin ve estas */}
      {role === 'admin' && (
        <>
          <Drawer.Screen name="Sensores" component={SensoresScreen} />
          <Drawer.Screen name="Mapa" component={MapScreen} />
          <Drawer.Screen name="Reportes" component={ReportsScreen} />
        </>
      )}
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const [role, setRole] = useState(null); // null = no logueado

  const handleLogin = (newRole) => {
    setRole(newRole); // 'admin', 'guest', etc.
  };

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <NavigationContainer>
      {role ? (
        <DrawerNavigator role={role} onLogout={handleLogout} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login">
            {() => <LoginScreen onLogin={handleLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}