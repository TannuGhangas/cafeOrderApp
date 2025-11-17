import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Clock } from 'lucide-react-native';

export default function OrderPlaced() {
    const router = useRouter();
    const { orderId, totalItems } = useLocalSearchParams();
    
    // Fallback data
    const displayOrderId = orderId || (Math.random() * 100000).toFixed(0);
    const displayTotalItems = totalItems || 'an unknown number of';

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: 'Order Confirmed', headerTitleStyle: { color: '#4A2C2A' } }} />
            
            <View style={styles.container}>
                <CheckCircle size={100} color="#10B981" style={styles.icon} />
                
                <Text style={styles.title}>Order Placed Successfully!</Text>
                
                <View style={styles.detailCard}>
                    <Text style={styles.detailHeader}>Your Order Details</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Order ID:</Text>
                        <Text style={styles.detailValue}>**#{displayOrderId}**</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Items:</Text>
                        <Text style={styles.detailValue}>{displayTotalItems} items</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Clock size={16} color="#A0522D" style={{ marginRight: 8 }} />
                        <Text style={styles.detailLabel}>Estimated Ready Time:</Text>
                        <Text style={styles.detailValue}>~10 minutes</Text>
                    </View>
                </View>
                
                <Text style={styles.thankYou}>Thank you for choosing Sip Station! We'll notify you when it's ready.</Text>
                
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => router.replace('/orders')} // Navigate to order history
                >
                    <Text style={styles.buttonText}>Track Order</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.homeButton}
                    onPress={() => router.replace('/')} // Navigate back to home
                >
                    <Text style={styles.homeButtonText}>Order Something Else</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAF0E6' },
    container: {
        flex: 1,
        padding: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#10B981',
        marginBottom: 20,
        textAlign: 'center',
    },
    detailCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        borderLeftWidth: 5,
        borderLeftColor: '#FF8C42',
    },
    detailHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A2C2A',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    detailLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
    },
    thankYou: {
        fontSize: 16,
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    button: {
        width: '100%',
        height: 55,
        borderRadius: 15,
        backgroundColor: '#FF8C42',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#FF8C42',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    homeButton: {
        marginTop: 10,
        padding: 10,
    },
    homeButtonText: {
        color: '#A0522D',
        fontSize: 16,
        fontWeight: '700',
    }
});