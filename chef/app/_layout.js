// chef-app/app/_layout.js
import { Stack } from 'expo-router';

export default function ChefLayout() {
  return (
    <Stack>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      {/* Main dashboard for aggregated view */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false, // We will use a custom header for the Dashboard
        }} 
      />
      {/* Detail view for an item */}
      <Stack.Screen 
        name="order-detail" 
        options={{ 
          title: 'Order Details',
          headerStyle: { backgroundColor: '#4A2C2A' },
          headerTintColor: '#FFFFFF',
        }} 
      />
    </Stack>
  );
}