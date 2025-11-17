// chef-app/app/splash.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Coffee } from 'lucide-react-native';

const COLORS = {
    primary: '#4A2C2A',    // Deep Coffee Brown
    secondary: '#B8860B',  // Dark Goldenrod
};

export default function ChefSplash() {
    const router = useRouter();

    useEffect(() => {
        // Simulate loading time and then redirect to the main dashboard
        const timer = setTimeout(() => {
            router.replace('/'); 
        }, 2000); 

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.logoContainer}>
                <Coffee size={80} color={COLORS.secondary} />
                <Text style={styles.title}>CHEF STATION</Text>
                <Text style={styles.subtitle}>Order Management Console</Text>
            </View>
            <ActivityIndicator size="large" color={COLORS.secondary} style={styles.indicator} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 50,
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        color: COLORS.textLight,
        letterSpacing: 2,
        marginTop: 15,
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.secondary,
        fontWeight: '600',
        marginTop: 5,
    },
    indicator: {
        position: 'absolute',
        bottom: 80,
    },
});