import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Coffee } from 'lucide-react-native';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    // Simulate loading/initialization time
    const timer = setTimeout(() => {
      // Replace with a check for authentication in a real app
      router.replace('/(tabs)/home'); 
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Coffee size={64} color="#FFF" />
      </View>
      <Text style={styles.title}>Sip Station</Text>
      <ActivityIndicator size="small" color="#FFF" style={styles.indicator} />
      <Text style={styles.subtitle}>Your Daily Dose</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF8C42', // A warm, engaging color
  },
  iconContainer: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#FFA75B',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    bottom: 50,
  },
  indicator: {
    marginTop: 20,
  },
});