// app/(drawer)/_layout.js
import { Drawer } from 'expo-router/drawer';
import { Coffee, User, ShoppingCart, Settings, Info } from 'lucide-react-native';
import React from 'react';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        // Crucial: Hides the default header so your custom header shows up
        headerShown: false,
        
        drawerStyle: {
          backgroundColor: '#FAF0E6', 
          width: 260,
        },
        drawerActiveTintColor: '#FFF', 
        drawerActiveBackgroundColor: '#A0522D', 
        drawerInactiveTintColor: '#4A2C2A', 
        drawerLabelStyle: {
          fontWeight: 'bold',
          fontSize: 16,
        },
      }}
    >
      {/* Name must match the file name in the (drawer) folder */}
      <Drawer.Screen
        name="index" // Links to app/(drawer)/index.js (Home)
        options={{
          drawerLabel: 'Home',
          title: 'Sip Station',
          drawerIcon: ({ color, size }) => <Coffee size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Orders" // Links to app/(drawer)/Orders.js
        options={{
          drawerLabel: 'My Orders',
          title: 'My Orders',
          drawerIcon: ({ color, size }) => <ShoppingCart size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile" // Links to app/(drawer)/Profile.js
        options={{
          drawerLabel: 'My Profile',
          title: 'My Profile',
          drawerIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Settings" // Links to app/(drawer)/Settings.js
        options={{
          drawerLabel: 'Settings',
          title: 'App Settings',
          drawerIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="About" // Links to app/(drawer)/About.js
        options={{
          drawerLabel: 'About App',
          title: 'About App',
          drawerIcon: ({ color, size }) => <Info size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}